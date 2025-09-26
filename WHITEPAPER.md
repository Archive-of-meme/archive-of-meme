# Archive of Memes — $ARCH

## Whitepaper v1.1 (Adjusted Version)

---

## 1) THESIS

The internet forgets fast. Memes are born, go viral, and disappear without context. Archive of Memes ($ARCH) turns the community into curators of the canon: every day we nominate, vote, and archive an immutable "Meme Capsule". If it's not in the Archive, it didn't happen.

**One-liner:** _"Your humor today, history forever."_

---

## 2) PRODUCT IN 30 SECONDS

- **Nominations** (00:00–16:00 UTC): Submit a meme (image/link/author/license/note)
- **Voting** (16:00–20:00 UTC): $ARCH holders vote
- **Archive** (20:00): **TOP 3 MEMES** are sealed in a Daily Capsule (hash + metadata) with unique URL `ARCH-YYYY-MM-DD`
- **Weekly Canon**: Sunday, 1 meme enters Canon by special vote
- **Credentials**: Soulbound badges: Nominator, Curator, Canon-Keeper

---

## 3) WHY IT MATTERS

- **Cultural**: Preserves key pieces with context and credit
- **Social**: On-chain status for good curation (not for buying more)
- **Technological**: Open metadata + API for builders
- **Memetic**: Simple daily ritual → high retention

---

## 4) TECHNICAL ARCHITECTURE (SOLANA)

### Core Components:

- **Network**: Solana
- **Storage**: Images and JSON on Arweave/IPFS
- **On-chain minimalist**: Program registers:
  ```
  DailyCapsule { date, arweave_tx, merkle_root, count=3 }
  WeeklyCanon { week_id, capsule_ref, item_id }
  ```

### Voting System:

- Off-chain signature (ed25519) + verification and snapshot at close
- Results (Merkle root) anchored on Solana (cheap and auditable)

### Public API:

- `/capsules/latest`
- `/capsules/{date}`
- `/canon`
- `/leaderboard`

### Anti-Sybil (Phase 2):

- Non-transferable reputation accumulated by:
  - Archived nominations (max X/month)
  - Sustained participation (streaks)
  - "Hits" (your nominee enters Capsule or Canon)

---

## 5) TOKEN

- **Ticker**: $ARCH
- **Fixed Supply**: 1,000,000,000
- **Tax**: 0%

### Initial Distribution:

- **90%** Launch (pump.fun/liquidity/open market)
- **5%** Archive Treasury (infra, domains, storage)
- **5%** Curation Fund (non-transferable rewards, gas, community grants)

### Utility:

- Access to daily voting
- Special curations
- Treasury governance
- Light API write gating

**$ARCH is not value nor promises yield. It's access/community.**

---

## 6) ARCHIVE RULES (IP/ETHICS)

- **Permissions**: Priority CC0/own/explicit permission
- **Transformation**: Transformative/parody memes ok
- **Takedown**: Clear process for legitimate authors
- **NSFW**: No pornography, no doxxing, no hate speech

---

## 7) GOVERNANCE

### Phase 0-1 (MVP):

- Treasury multisig (3/5) + signal votes (snapshot)

### Phase 2:

- AIP (Archive Improvement Proposal) system
- Quorum: ≥ 5% active voters from last 30 days

---

## 8) SECURITY & RISKS

- **Technical**: Upload sanitization, size and type limits
- **Sybil/social**: Limits per wallet/day
- **Market risks**: Extreme volatility. You can lose everything
- **Legal/IP risks**: License compliance, claims channel

---

## 9) KEY METRICS (KPIs)

- DAU of voters and 7/30 day return rate
- % of nominations with complete metadata
- Average time to archive
- API/embeds consumption
- Active streaks and reputation distribution

---

## 10) ROADMAP (NO SMOKE)

### Week 1-2:

- Launch $ARCH
- Landing page
- Basic nomination/vote system
- Daily Capsule (3 memes)

### Month 1:

- Profiles with SBT badges
- Leaderboard
- Public API (read-only)

### Month 2:

- Weekly Canon
- X bot
- Embeds

### Month 3+:

- Reputation system
- Thematic filters
- Builder grants

---

## 11) BRAND EXPERIENCE

- **Aesthetic**: "Classic archive" + pencil sketch style (Arch character)
- **Consistent copy**: _"Archive it or it didn't happen"_ / _"Memes fade. Archives don't"_
- **Daily ritual**: ARCH-YYYY-MM-DD mosaic with 3 pieces → shared on X

---

## 12) TREASURY ECONOMY

### Expected expenses:

- Storage (Arweave pins/bridges)
- Domains
- Moderation
- Audits
- Bounties

### Optional income:

- Merch
- Donations
- Non-intrusive sponsorships

**Policy**: 100% on-chain, monthly reports

---

## 13) COMPLIANCE & DISCLAIMER

This is a community and cultural project. Not financial advice. $ARCH does not grant profit participation or return expectations. High risk, high volatility. Comply with local laws before interacting.

---

## APPENDIX A: METADATA SCHEMA

```json
{
  "title": "Wojak at McDonald's",
  "creator": "user_or_handle",
  "source_url": "https://...",
  "license": "CC0|CC-BY|Permission",
  "notes": "context/origin",
  "image_cid": "ipfs://...",
  "hash_sha256": "...",
  "capsule_date": "2025-09-25",
  "credit_attribution": "© author / handle",
  "tags": ["wojak", "wagmi", "mcdonalds"]
}
```

---

## APPENDIX B: SIMPLIFIED LAUNCH APPROACH

### Phase 1 (Launch):

- Simple voting: has $ARCH = can vote (1 wallet = 1 vote)
- No complex reputation initially
- Focus on core loop working

### Phase 2 (Growth):

- Add reputation system
- Quadratic voting weights
- Advanced anti-sybil

---

## CALL TO ACTION

- **Builders**: Integrate the feed in your bot/site
- **Creators**: Nominate your pieces, claim credit
- **Curators**: Vote daily and earn on-chain status

---

**Archive of Memes — $ARCH**
_If it's not in the Archive, it didn't exist._

---

### Key Changes in v1.1:

1. **3 memes daily** instead of 5 (more exclusive, better quality)
2. **Simplified Phase 1** - Basic voting without complex reputation
3. **Realistic timeline** - MVP first, complexity later
4. **Arch character** integrated in brand
5. **Cleaner structure** - Easier to implement

---

_Document version: 1.1_
_Last updated: September 2025_
_Status: Ready for implementation_
