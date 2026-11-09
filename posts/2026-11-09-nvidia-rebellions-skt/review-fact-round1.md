# Fact review: 2026-11-09-nvidia-rebellions-skt

Verdict: FAIL (two wording fixes needed; everything else matches)

Both sources opened with scripts/article.mjs. The Newsroom article's `published` field is blank, but the text says "today" and the blog is dated 2026-11-09, so the Nov 9 date holds.

## Issues
1. Slide 3, "The R200 is meant for multitrillion-parameter mixture-of-experts models."
   - Problem: the article says the R200 is "optimized for low-latency and energy-efficient inference using frontier models, including multitrillion-parameter mixture-of-experts models". "Meant for" narrows this to MoE models only.
   - Fix: "Rebellions says the R200 is optimized for low-latency, energy-efficient inference with frontier models, including multitrillion-parameter mixture-of-experts models." Shorten it if it overflows.
2. Slide 5, "...with training programs and Dynamo inference software for three AI for All consortia and four Korean model builders."
   - Problem: the wording suggests training programs go to the consortia and builders. The blog says the training, certification, hackathons and seminars are part of the NVIDIA-MSIT collaboration "to strengthen GPU utilization". Only Dynamo is tied to the three consortia and four builders.
   - Fix: "Nvidia says its wider Korea push covers more than chips: training programs for Korea, and Dynamo inference software for three AI for All consortia and four Korean model builders."

## Verified OK
- Cover: "NVIDIA GPUS + KOREAN NPUS".
- Slide 1: the three companies, the collaboration, Rebellions as a Korean startup, R200 linked via NVLink Fusion, and ministry support.
- Slide 2: GPUs for prefill and NPUs for decode (the plain-language glosses are the writer's).
- Slide 3: the NVLink Fusion description, and throughput and power efficiency.
- Slide 4: SK Telecom deploys in its AI data center and connects to its models and AI for All services. "A Korean telecom company" is a plain, widely known description.
- Slide 5: R200 systems "expected to be ready for deployment in 2028".
- Caption and threads_caption: they match the sources. The source titles and dates are correct.
