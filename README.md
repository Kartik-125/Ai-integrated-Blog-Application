# DailyReads

A full-stack blogging platform with an editorial review workflow and three AI features built on the Gemini API — including a retrieval-augmented (RAG) chatbot that answers questions using the site's own published posts as its source of truth.

## Stack

**Frontend:** React (Vite), Tailwind CSS, Quill rich-text editor, React Router
**Backend:** Node.js, Express, Mongoose
**Database:** MongoDB Atlas (with Atlas Vector Search)
**AI:** Google Gemini API (`@google/genai`) — `gemini-3.5-flash-lite` for generation, `gemini-embedding-001` for embeddings
**Other:** JWT auth, ImageKit (image hosting), Resend (transactional email)

## Features

### Editorial workflow
Three roles — public reader, author, and admin. Authors write and submit posts; every submission enters a `pending` state and stays unpublished until an admin approves it. Rejected posts are returned to the author with a reason attached, editable and resubmittable from their dashboard.

### AI: Generate with AI
On the create/edit blog pages, an author can supply a title (optionally a category and excerpt) and have Gemini draft a full post as clean HTML, which drops straight into the Quill editor for editing. The model is prompted to return only body-level tags so the output is directly editor-compatible.

### AI: Admin review assist
On the admin review page, a "Run AI Check" button sends the submitted post to Gemini with a structured-output schema, returning a JSON verdict (`ok` / `flag`), a list of specific issues, and reasoning. The prompt targets concrete problems — spam, hate speech, placeholder content, broken markup — and explicitly avoids flagging tone, typos, or disagreeable opinions.

When a post is flagged, the detected issues are pre-filled into the rejection reason box as an editable list, so the admin can send precise, actionable feedback in one click. **The AI never decides anything** — approve and reject remain human actions.

### AI: Ask DailyReads (RAG chatbot)
A floating chat widget available to logged-in users on every page. Visitors ask a natural-language question and get an answer grounded in the site's published posts, along with links to the source posts the answer drew from.

## How the RAG pipeline works

RAG exists to solve one problem: the language model has never read this site's posts. It only knows its training data plus whatever text is included in the prompt. So the system finds the relevant passages first, then asks the model to answer using only those.

This happens in two phases, at different times.

### Phase 1 — Indexing (on blog approval)

```
Admin approves blog
   └─> indexBlog(blog)
         ├─ delete any existing chunks for this blog   (avoids stale duplicates on re-index)
         ├─ chunkText()   → split content into ~500-word overlapping chunks
         ├─ embedText()   → Gemini embedding per chunk  (taskType: RETRIEVAL_DOCUMENT)
         └─ Chunk.insertMany()  → { blog, text, embedding[3072], chunkIndex }
```

**Why chunk instead of embedding the whole post?** A single vector for a 2,000-word post represents the average meaning of the whole thing. A specific detail in paragraph seven gets diluted and becomes hard to retrieve. Smaller chunks produce more focused vectors.

**Why overlap the chunks?** A hard cut every 500 words can split an idea across a boundary so that neither chunk fully contains it. Advancing by 450 words instead of 500 means each chunk shares its tail with the next one's head.

**Why run indexing inside its own `try/catch`?** Approval is the core action and must persist; indexing is an enhancement on top. A Gemini rate limit or network blip logs an error server-side but never blocks or reverses the approval.

### Phase 2 — Retrieval and answering (per question)

```
POST /api/ai/ask   { question }
   ├─ embedText(question, RETRIEVAL_QUERY)      → question vector
   ├─ searchChunks()  → $vectorSearch on Atlas  → top 5 nearest chunks
   ├─ (no matches? return a friendly message, skip the Gemini call)
   ├─ answerFromContext()  → Gemini answers using ONLY those chunks
   └─ dedupe chunk→blog, look up titles
        └─> { answer, sources: [{ id, title }] }
```

**Why two different `taskType` values?** Gemini's embedding model produces subtly different vectors depending on whether text is a stored document or a search query. Using the matching type on each side measurably improves retrieval, because a question and its answer often share very little vocabulary.

**What makes this RAG rather than a plain chat call?** The prompt instructs the model to answer using only the retrieved excerpts and to say plainly when they don't contain enough information. Without that grounding instruction, the model would fall back on general world knowledge and the retrieval step would be wasted.

**Why search globally rather than per-post?** `$vectorSearch` runs across every chunk from every approved post, so a question is answered from wherever the best material lives — potentially several posts at once. The returned `sources` list is how the reader sees which posts the answer came from and can click through to read them in full.

## Setup

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (the free M0 tier is sufficient, including for vector search)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com)

### Install

```bash
# backend
cd server
npm install

# frontend
cd ../client
npm install
```

### Environment variables (`server/.env`)

```
MONGODB_URI=your_atlas_connection_string
GEMINI_API_KEY=your_gemini_key
USER_JWT_SECRET=...
ADMIN_JWT_SECRET=...
IMAGEKIT_PUBLIC_KEY=...
IMAGEKIT_PRIVATE_KEY=...
IMAGEKIT_URL_ENDPOINT=...
RESEND_API_KEY=...
PORT=3000
```

### Atlas Vector Search index (one-time, required for the chatbot)

In the Atlas dashboard: **Search → Create Search Index → Atlas Vector Search → JSON Editor**, targeting the `chunks` collection. Name it `vector_index` and use:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 3072,
      "similarity": "cosine"
    }
  ]
}
```

`numDimensions` must match the embedding model's output size — a mismatch here is the most common setup failure. Wait for the index status to reach **Active** before using the chatbot.

### Run

```bash
cd server && npm run server     # nodemon, port 3000
cd client && npm run dev        # Vite
```

## API — AI routes

| Method | Endpoint | Auth | Rate limit | Purpose |
|---|---|---|---|---|
| POST | `/api/ai/generate-content` | user | 15/hr | Draft a blog post from a title |
| POST | `/api/ai/review-blog` | admin | 30/hr | Structured moderation pre-check |
| POST | `/api/ai/ask` | user | 20/15min | RAG question answering |

Rate limits are keyed per authenticated user rather than per IP, so users sharing a network don't consume each other's quota. They exist because the Gemini free tier has hard daily caps that a single user could otherwise exhaust for everyone.

## Project structure

```
server/
  configs/        gemini.js (all model calls), db.js, imageKit.js
  controllers/    ai, blog, admin, user
  middleware/     userAuth, authAdmin, aiRateLimit, errorHandler, multer
  models/         Blog, Chunk, Comment, User
  routes/         aiRoutes, blogRoutes, adminRoutes, userRoutes
  utils/          chunkText, indexBlog, searchChunks, asyncHandler, sendEmail

client/src/
  components/     AskDailyReads (chat widget), Navbar, BlogCard, ...
  pages/          Home, Blog, user/*, admin/*
  context/        AppContext (axios instance + auth tokens)
```

## Notes and known limitations

- The chatbot can only answer about posts approved *after* the indexing pipeline was added — earlier posts have no chunks stored unless re-approved.
- The rate limiter uses an in-memory store, so counts reset on server restart and aren't shared across multiple instances. A Redis store would be the upgrade path.
- Gemini model names change frequently; a sudden `404 NOT_FOUND` on an AI route usually means the model string in `configs/gemini.js` needs updating rather than a code bug.