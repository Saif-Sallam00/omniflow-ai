# Phase 1 — Solutions Page Build Spec · v2

**Supersedes v1.** Changes from v1 are listed in §11.
**Page:** Solutions · **URL:** `/services` (unchanged) · **Languages:** EN + AR (MSA, RTL)
**Current-state source:** `WEBSITE-CONTENT-INVENTORY.md` (commit `381fe70`)

---

## 0. The model

```
                        Diagnosis
                            |
        ------------------------------------------
        |               |                |
   Foundation    Growth Engine    Scale Infrastructure
        |               |                |
        ------------------------------------------
                            |
                  Custom Transformation
                  (when none of the three fit)
```

Not a ladder. Three entry points for three different constraints, one diagnosis behind all of them, plus an exception path. Internally the maturity sequence still holds; externally nobody is forced through it.

**Positioning statement this page must deliver:**
> OmniflowAI helps growing companies identify what is blocking their next stage of growth, then builds the AI, marketing, and technology systems required to scale.

### Locked decisions

| # | Decision |
|---|---|
| 1 | No external ladder. Solutions are constraint-based paths, not tiers. |
| 2 | Foundation promises **diagnosis**, never implementation. |
| 3 | Scale inherits the **visibility layer only** (measurement, reporting, data connection) — not the full Growth Engine scope. |
| 4 | Strategy is method, not a capability card. Three capabilities: Marketing Systems · Business Technology · AI Enablement. |
| 5 | Slugs unchanged. Clean labels in UI, keyword-rich H1s and meta on the capability pages. |
| 6 | Old `services.*` keys deprecated, not deleted. Removal ticketed in the same phase. |
| 7 | Problem recognition section sits before the solutions. Router sits before the cards. |
| 8 | `Starting from $X` + "Final scope is determined after diagnosis." + "Not a monthly retainer. A system your business owns." |
| 9 | "Solution" externally, "engagement" internally. |
| 10 | One primary CTA site-wide: "Book a strategy call". |

---

## 1. Page flow

```
1  Hero
2  Problem recognition
3  Diagnostic router
4  The three solutions
5  Custom Transformation
6  How we work            (Strategy → three capabilities)
7  Proof                  (hidden when no featured projects)
8  FAQ
9  Final CTA
```

The router sits above the cards on purpose. If the entry question is "what's blocking your growth," the solutions are the answer — they can't be shown first.

---

## 2. Copy — English + Arabic

Key prefix `solutions.*`. All keys new.

### 2.1 Hero

| Key | English | Arabic |
|---|---|---|
| `solutions.eyebrow` | Solutions | الحلول |
| `solutions.h1.lead` | Build the systems behind | ابنِ الأنظمة التي يقوم عليها |
| `solutions.h1.accent` | your next stage of growth. | نموك في المرحلة القادمة. |
| `solutions.subhead` | Your business already works. What it needs now is the infrastructure to scale. We find what's blocking growth, then build the marketing, technology, and AI systems that remove it. | أعمالك تعمل بالفعل. ما تحتاجه الآن هو البنية التي تتيح لها التوسّع. نكتشف ما الذي يعيق النمو، ثم نبني أنظمة التسويق والتقنية والذكاء الاصطناعي التي تزيله. |
| `cta.primary` *(existing)* | Book a strategy call | احجز مكالمة استراتيجية |
| `solutions.hero.secondary` | Find your starting point | حدّد نقطة البداية |

`hero.secondary` scrolls to §3. It does not navigate.

### 2.2 Problem recognition

| Key | English | Arabic |
|---|---|---|
| `solutions.problem.heading` | Growth creates new problems. | النمو يخلق مشكلات جديدة. |
| `solutions.problem.sub` | You built a successful business. The systems that got you here aren't always the systems that take you further. | لقد بنيت عملاً ناجحاً. لكن الأنظمة التي أوصلتك إلى هنا ليست دائماً الأنظمة التي تأخذك إلى أبعد. |
| `solutions.problem.item1` | Growth depends on a few people. | النمو يعتمد على عدد قليل من الأشخاص. |
| `solutions.problem.item2` | Your tools don't talk to each other. | أدواتك لا تتحدّث إلى بعضها. |
| `solutions.problem.item3` | Teams repeat the same manual work. | الفِرق تكرّر العمل اليدوي نفسه. |
| `solutions.problem.item4` | You can't see what's actually driving revenue. | لا ترى ما الذي يقود الإيرادات فعلاً. |
| `solutions.problem.item5` | AI is everywhere, but nobody on the team really uses it. | الذكاء الاصطناعي في كل مكان، لكن لا أحد في الفريق يستخدمه فعلاً. |
| `solutions.problem.close` | None of these is a tool problem. They're system problems — and they get diagnosed before they get built. | لا شيء من هذا مشكلة أداة. كلها مشكلات أنظمة — تُشخَّص قبل أن تُبنى. |

### 2.3 Diagnostic router

| Key | English | Arabic |
|---|---|---|
| `solutions.router.heading` | What's blocking your growth? | ما الذي يعيق نموك؟ |
| `solutions.router.sub` | Pick what sounds most like your business. We'll point you to the right starting point. | اختر ما يشبه وضع أعمالك أكثر، وسنوجّهك إلى نقطة البداية المناسبة. |
| `solutions.router.q1` | We have customers, but growth is inconsistent. | لدينا عملاء، لكن النمو غير منتظم. |
| `solutions.router.q2` | Our growth depends on adding more people instead of better systems. | نموّنا يعتمد على زيادة عدد الموظفين بدلاً من أنظمة أفضل. |
| `solutions.router.q3` | We have tools, but nothing is connected. | لدينا أدوات، لكن لا شيء مترابط. |
| `solutions.router.q4` | We know AI matters but don't know where to start. | نعلم أن الذكاء الاصطناعي مهم، لكن لا نعرف من أين نبدأ. |
| `solutions.router.q5` | We're not sure what's actually broken. | لسنا متأكدين ما الذي تعطّل فعلاً. |
| `solutions.router.q6` | We have a unique challenge that needs a tailored approach. | لدينا تحدٍّ فريد يحتاج إلى نهج مصمَّم خصيصاً. |
| `solutions.router.resultLabel` | Recommended starting point | نقطة البداية المقترحة |
| `solutions.router.r1` | Your acquisition needs to become a system before more technology gets built on top of it. | يجب أن يتحوّل الاستقطاب لديك إلى نظام قبل بناء مزيد من التقنية فوقه. |
| `solutions.router.r2` | Headcount-driven growth is an infrastructure limit. The systems have to carry that load instead. | النمو المعتمد على زيادة الموظفين هو حدٌّ في البنية التحتية. الأنظمة هي ما يجب أن يحمل هذا العبء بدلاً من ذلك. |
| `solutions.router.r3` | Disconnected tools is an infrastructure problem, not a marketing one. | الأدوات غير المترابطة مشكلة بنية تحتية، لا مشكلة تسويق. |
| `solutions.router.r4` | Start by finding where AI actually pays off inside your workflows. | ابدأ بتحديد أين يحقّق الذكاء الاصطناعي عائداً فعلياً داخل سير عملك. |
| `solutions.router.r5` | That's exactly what the diagnosis is for. Nobody should build before that answer exists. | هذا بالضبط ما وُجد التشخيص من أجله. لا ينبغي لأحد أن يبني قبل أن تتوفّر هذه الإجابة. |
| `solutions.router.r6` | Then the answer is a system designed around your constraints, not a predefined scope. | إذن الإجابة نظام مصمَّم حول قيودك، لا نطاق مُعدّ مسبقاً. |
| `solutions.router.unsure` | Rather just talk it through? Book a strategy call. | تفضّل الحديث مباشرة؟ احجز مكالمة استراتيجية. |

**Routing map:** q1 → Growth Engine · q2 → Scale Infrastructure · q3 → Scale Infrastructure · q4 → Foundation · q5 → Foundation · q6 → Custom Transformation

### 2.4 Solutions — section frame

| Key | English | Arabic |
|---|---|---|
| `solutions.grid.heading` | Three ways in. One business diagnosis behind all of them. | ثلاث نقاط دخول. وتشخيص أعمال واحد وراءها جميعاً. |
| `solutions.grid.sub` | These aren't tiers. They're different starting points for different constraints. The business diagnosis decides which one fits. | هذه ليست مستويات. بل نقاط بداية مختلفة لقيود مختلفة. وتشخيص الأعمال هو ما يحدّد الملائم منها. |
| `solutions.grid.bestFor` | Best for | مناسب لـ |
| `solutions.grid.problem` | The problem | المشكلة |
| `solutions.grid.included` | What's included | ما الذي يشمله |
| `solutions.grid.outcome` | Outcome | النتيجة |
| `solutions.grid.priceFrom` | Starting from | يبدأ من |
| `solutions.grid.priceNote1` | Final scope is determined after the business diagnosis. | يُحدَّد النطاق النهائي بعد تشخيص الأعمال. |
| `solutions.grid.priceNote2` | Not a monthly retainer. A system your business owns. | ليس اشتراكاً شهرياً. بل نظام تملكه أعمالك. |
| `solutions.grid.detailLink` | See the full solution | تفاصيل الحل كاملة |

### 2.5 Foundation

| Key | English | Arabic |
|---|---|---|
| `solutions.foundation.name` | Foundation | Foundation *(untranslated, LTR)* |
| `solutions.foundation.tagline` | Discover what's blocking your next stage of growth. | اكتشف ما الذي يعيق مرحلتك التالية من النمو. |
| `solutions.foundation.bestFor` | Companies that know something is limiting growth but can't name it — and don't want to commit to a build before they can. | شركات تعرف أن شيئاً ما يحدّ من نموها لكنها لا تستطيع تسميته — ولا تريد الالتزام ببناء قبل أن تستطيع. |
| `solutions.foundation.problem` | Your business is growing, but the reason it's slowing isn't obvious from the inside. Every proposal you receive assumes an answer nobody has actually verified. | أعمالك تنمو، لكن سبب تباطؤها ليس واضحاً من الداخل. وكل عرض يصلك يفترض إجابة لم يتحقّق منها أحد فعلاً. |
| `solutions.foundation.inc1.title` | Business Diagnosis | تشخيص الأعمال |
| `solutions.foundation.inc1.body` | How the business actually runs today — processes, handoffs, and where work stops moving. | كيف تعمل الأعمال فعلاً اليوم — العمليات وعمليات التسليم وأين يتوقّف العمل. |
| `solutions.foundation.inc2.title` | Workflow and bottleneck assessment | تقييم سير العمل والاختناقات |
| `solutions.foundation.inc2.body` | The specific points where growth is being limited, and what each one is costing. | النقاط المحدّدة التي يُقيَّد عندها النمو، وكلفة كلٍّ منها. |
| `solutions.foundation.inc3.title` | Growth and technology opportunity map | خريطة فرص النمو والتقنية |
| `solutions.foundation.inc3.body` | Where marketing, systems, and automation create measurable impact — and in what order. | أين يصنع التسويق والأنظمة والأتمتة أثراً قابلاً للقياس — وبأي ترتيب. |
| `solutions.foundation.inc4.title` | AI opportunity identification | تحديد فرص الذكاء الاصطناعي |
| `solutions.foundation.inc4.body` | Which workflows are genuinely worth applying AI to, and which aren't. | أي مسارات العمل تستحق فعلاً تطبيق الذكاء الاصطناعي عليها، وأيها لا. |
| `solutions.foundation.outcome` | A clear roadmap showing where technology, AI, and systems create measurable business impact. | خارطة طريق واضحة تُبيّن أين تصنع التقنية والذكاء الاصطناعي والأنظمة أثراً قابلاً للقياس. |
| `solutions.foundation.note` | Foundation produces a decision, not a deliverable. If you build with us afterwards, the work carries forward. | Foundation يُنتج قراراً لا مخرجاً. وإن بنيت معنا بعده، فإن العمل ينتقل إلى ما يليه. |
| `solutions.foundation.credit` | Move forward with implementation within 90 days and your Foundation fee is credited toward the project. | إن مضيت في التنفيذ خلال 90 يوماً، تُخصم قيمة Foundation من قيمة المشروع. |

> Every line in this card was checked for implementation language. If a future edit reintroduces "build," "create," or "deliver" into Foundation copy, the positioning breaks.

### 2.6 Growth Engine

| Key | English | Arabic |
|---|---|---|
| `solutions.growth.name` | Growth Engine | Growth Engine *(untranslated, LTR)* |
| `solutions.growth.tagline` | Turn growth into a system you can measure. | حوّل النمو إلى نظام يمكن قياسه. |
| `solutions.growth.bestFor` | Companies with real demand, held back by inconsistent acquisition, scattered marketing, and manual follow-through. | شركات لديها طلب حقيقي، يعيقها استقطاب غير منتظم وتسويق متفرّق ومتابعة يدوية. |
| `solutions.growth.problem` | Revenue is growing, but growth depends on disconnected campaigns, manual processes, and people pushing everything forward. | الإيرادات تنمو، لكن النمو يعتمد على حملات غير مترابطة وعمليات يدوية وأشخاص يدفعون كل شيء إلى الأمام. |
| `solutions.growth.inc1.title` | Marketing Systems | أنظمة التسويق |
| `solutions.growth.inc1.body` | SEO, paid acquisition, conversion optimization, funnel tracking, and performance measurement — wired together as one engine. | تحسين محركات البحث، والاستقطاب المدفوع، وتحسين التحويل، وتتبّع المسار، وقياس الأداء — مترابطة معاً كمحرّك واحد. |
| `solutions.growth.inc2.title` | AI Enablement | تمكين الذكاء الاصطناعي |
| `solutions.growth.inc2.body` | Department-specific use cases, workflow adoption, and practical team enablement — so AI ends up in daily work, not in a training deck. | استخدامات خاصة بكل قسم، وتبنٍّ داخل سير العمل، وتمكين عملي للفريق — ليصبح الذكاء الاصطناعي جزءاً من العمل اليومي لا شريحة في عرض تدريبي. |
| `solutions.growth.inc3.title` | Business Automation | أتمتة الأعمال |
| `solutions.growth.inc3.body` | CRM improvements, workflow automation, and data connection across the tools you already use. | تحسين إدارة العملاء، وأتمتة سير العمل، وربط البيانات عبر الأدوات التي تستخدمها بالفعل. |
| `solutions.growth.outcome` | More qualified opportunities, clearer visibility, and a team operating with AI inside real workflows. | فرص أكثر تأهيلاً، ورؤية أوضح، وفريق يعمل بالذكاء الاصطناعي داخل مسارات عمل حقيقية. |

### 2.7 Scale Infrastructure

| Key | English | Arabic |
|---|---|---|
| `solutions.scale.name` | Scale Infrastructure | Scale Infrastructure *(untranslated, LTR)* |
| `solutions.scale.tagline` | Build the systems required for operational scale. | ابنِ الأنظمة اللازمة للتوسّع التشغيلي. |
| `solutions.scale.bestFor` | Companies where growth has outgrown the operation — complexity is rising and the current systems can't carry it. | شركات تجاوز نموّها تشغيلها — التعقيد يتصاعد والأنظمة الحالية لا تستطيع حمله. |
| `solutions.scale.problem` | Growth creates complexity. Disconnected tools, manual operations, and limited visibility start slowing the business down — and adding people stops helping. | النمو يولّد التعقيد. الأدوات غير المترابطة والعمليات اليدوية والرؤية المحدودة تبدأ في إبطاء الأعمال — وزيادة الموظفين تتوقّف عن الإفادة. |
| `solutions.scale.alwaysLabel` | Always included | مشمول دائماً |
| `solutions.scale.always` | The visibility layer: measurement, reporting, and business data connection — so the decisions after the build are made on evidence, not instinct. | طبقة الرؤية: القياس والتقارير وربط بيانات الأعمال — لتُتّخذ القرارات بعد البناء على أدلة لا على حدس. |
| `solutions.scale.expandsLabel` | Then expands, based on the business diagnosis, into: | ثم يتوسّع، بناءً على تشخيص الأعمال، ليشمل: |
| `solutions.scale.inc1.title` | Business Technology | تقنية الأعمال |
| `solutions.scale.inc1.body` | CRM and ERP platforms, internal systems, and customer-facing platforms — built to own, integrate, and scale. | منصّات إدارة العملاء وتخطيط الموارد، والأنظمة الداخلية، والمنصّات الموجّهة للعملاء — مبنية لتملكها وتربطها وتوسّعها. |
| `solutions.scale.inc2.title` | Advanced automation and AI | أتمتة وذكاء اصطناعي متقدّم |
| `solutions.scale.inc2.body` | AI-powered workflows, process automation, and cross-department systems that remove manual handoffs. | مسارات عمل مدعومة بالذكاء الاصطناعي، وأتمتة العمليات، وأنظمة عابرة للأقسام تزيل عمليات التسليم اليدوية. |
| `solutions.scale.inc3.title` | Operational enablement | التمكين التشغيلي |
| `solutions.scale.inc3.body` | Process redesign, adoption support, and the change work that makes new systems stick after handover. | إعادة تصميم العمليات، ودعم التبنّي، وعمل التغيير الذي يجعل الأنظمة الجديدة تستمر بعد التسليم. |
| `solutions.scale.outcome` | A scalable business infrastructure built around how your company actually operates. | بنية أعمال قابلة للتوسّع مبنية حول الطريقة التي تعمل بها شركتك فعلاً. |

### 2.8 Custom Transformation

| Key | English | Arabic |
|---|---|---|
| `solutions.custom.eyebrow` | Does your situation not fit a common pattern? | وضعك لا يشبه الأنماط الشائعة؟ |
| `solutions.custom.name` | Custom Transformation | Custom Transformation *(untranslated, LTR)* |
| `solutions.custom.body` | Some businesses don't match the common patterns. Strong sales with broken operations. AI adoption across every department at once. A combination no standard scope covers. When the diagnosis points somewhere none of the three above fit, we design the transformation around your business, your goals, and your constraints. | بعض الأعمال لا تطابق الأنماط الشائعة. مبيعات قوية مع عمليات مكسورة. تبنٍّ للذكاء الاصطناعي عبر كل الأقسام دفعة واحدة. تركيبة لا يغطّيها أي نطاق جاهز. حين يشير التشخيص إلى ما لا يناسبه أيٌّ من الثلاثة أعلاه، نصمّم التحوّل حول أعمالك وأهدافك وقيودك. |
| `solutions.custom.composed` | Built from the same four parts — strategy, marketing systems, business technology, and AI enablement — in whatever proportion the business diagnosis calls for. | مبني من الأجزاء الأربعة نفسها — الاستراتيجية وأنظمة التسويق وتقنية الأعمال وتمكين الذكاء الاصطناعي — بالنِّسَب التي يستدعيها تشخيص الأعمال. |
| `solutions.custom.price` | Priced after the business diagnosis. | يُسعَّر بعد تشخيص الأعمال. |

### 2.9 How we work

| Key | English | Arabic |
|---|---|---|
| `solutions.work.heading` | How we work | كيف نعمل |
| `solutions.work.strategy.label` | Strategy | الاستراتيجية |
| `solutions.work.strategy.body` | We diagnose the business, identify the constraints, and define the roadmap. Strategy isn't something we sell — it's how everything else gets decided. | نُشخّص الأعمال، ونحدّد القيود، ونضع خارطة الطريق. الاستراتيجية ليست شيئاً نبيعه، بل الطريقة التي تُتّخذ بها كل القرارات الأخرى. |
| `solutions.work.divider` | Three capabilities deliver the transformation | وثلاث قدرات تُنفّذ التحوّل |
| `solutions.work.marketing.title` | Marketing Systems | أنظمة التسويق |
| `solutions.work.marketing.body` | Build measurable acquisition systems — search, paid, conversion, and tracking wired together instead of run separately. | بناء أنظمة استقطاب قابلة للقياس — بحث وإعلانات مدفوعة وتحويل وقياس مترابطة معاً بدلاً من تشغيلها منفصلة. |
| `solutions.work.tech.title` | Business Technology | تقنية الأعمال |
| `solutions.work.tech.body` | Build and connect the systems the business runs on — ERP, CRM, web and mobile platforms, and the automation between them. | بناء وربط الأنظمة التي تدير بها الأعمال — تخطيط الموارد وإدارة العملاء ومنصّات الويب والجوال والأتمتة بينها. |
| `solutions.work.ai.title` | AI Enablement | تمكين الذكاء الاصطناعي |
| `solutions.work.ai.body` | Embed AI into real workflows so teams actually use it, inside the work they already do. | دمج الذكاء الاصطناعي في مسارات العمل الحقيقية ليستخدمه الفريق فعلاً، ضمن العمل الذي يؤدّيه أصلاً. |

Capability cards link to `/services/digital-marketing`, `/services/software`, `/services/ai-training`.

> **Honesty constraint:** AI Enablement copy states capability only — no results claim, no client count, no "proven" framing — until delivery history exists. Hard rule for review.

### 2.10 Proof

| Key | English | Arabic |
|---|---|---|
| `solutions.proof.heading` | What this looks like in practice | كيف يبدو هذا على أرض الواقع |
| `solutions.proof.sub` | Real engagements, and what changed in the business. | تعاونات حقيقية، وما الذي تغيّر في الأعمال. |

Reuses the featured-projects component. Section hidden entirely when none exist, matching the homepage Proof behaviour.

### 2.11 FAQ

| Key | English | Arabic |
|---|---|---|
| `solutions.faq.heading` | Common questions | أسئلة شائعة |
| `solutions.faq.q1` | How do we know which solution we need? | كيف نعرف أي حل نحتاج؟ |
| `solutions.faq.a1` | Most companies don't, and that's fine. The business diagnosis exists to answer that question before anyone commits to a build. | معظم الشركات لا تعرف، وهذا طبيعي. تشخيص الأعمال موجود للإجابة عن هذا السؤال قبل الالتزام بأي تنفيذ. |
| `solutions.faq.q2` | Do we have to start with Foundation? | هل يجب أن نبدأ بـ Foundation؟ |
| `solutions.faq.a2` | No. Foundation is for companies that can't yet name the constraint. If it's already clear, we start where the problem is. Every solution includes a business diagnosis phase either way. | لا. Foundation مخصّص للشركات التي لا تستطيع بعد تسمية القيد. وإن كان واضحاً بالفعل، فنبدأ من حيث المشكلة. وكل حل يشمل مرحلة تشخيص أعمال في الحالتين. |
| `solutions.faq.q3` | Why is pricing "starting from"? | لماذا السعر «يبدأ من»؟ |
| `solutions.faq.a3` | Because scope depends on what the business diagnosis finds. The figure shown is the floor. The final number comes with the proposal. | لأن النطاق يعتمد على ما يكشفه تشخيص الأعمال. الرقم المعروض هو الحد الأدنى، والرقم النهائي يأتي مع العرض. |
| `solutions.faq.q4` | Is this a monthly retainer? | هل هذا اشتراك شهري؟ |
| `solutions.faq.a4` | No. These are systems you own — source code, platforms, and data. Ongoing support is a separate agreement if you want one. | لا. هذه أنظمة تملكها — الشيفرة المصدرية والمنصّات والبيانات. أما الدعم المستمر فاتفاق منفصل إن أردته. |
| `solutions.faq.q5` | Do we own what you build? | هل نملك ما تبنونه؟ |
| `solutions.faq.a5` | Yes. Full source code and IP transfer on completion. No lock-in, no fee to access your own system. | نعم. تُنقل الملكية الفكرية وكامل الشيفرة المصدرية عند الإنجاز. لا تقييد، ولا رسوم للوصول إلى نظامك. |
| `solutions.faq.q6` | What happens to the Foundation fee if we implement? | ماذا يحدث لقيمة Foundation إن مضينا في التنفيذ؟ |
| `solutions.faq.a6` | It's credited toward the project, provided implementation starts within 90 days and is based on that diagnosis. It isn't a refund — you bought a roadmap, and you keep it whether you build with us or not. | تُخصم من قيمة المشروع، شريطة أن يبدأ التنفيذ خلال 90 يوماً وأن يستند إلى ذلك التشخيص. وهي ليست استرداداً — لقد اشتريت خارطة طريق، وتبقى لك سواء بنيت معنا أم لا. |
| `solutions.faq.q7` | Is AI training sold separately? | هل يُباع التدريب على الذكاء الاصطناعي بشكل منفصل؟ |
| `solutions.faq.a7` | No. AI enablement is built into every solution, because training that isn't attached to a real workflow doesn't survive the month after it ends. | لا. تمكين الذكاء الاصطناعي مدمج في كل حل، لأن التدريب غير المرتبط بسير عمل حقيقي لا يصمد بعد انتهائه بشهر. |

### 2.12 Final CTA

| Key | English | Arabic |
|---|---|---|
| `solutions.cta.heading` | Not sure what's blocking you? | لست متأكداً ما الذي يعيقك؟ |
| `solutions.cta.body` | Book a strategy call. We'll tell you honestly where the constraint is — and if we're not the right partner, we'll say that too. | احجز مكالمة استراتيجية. سنخبرك بصراحة أين يقع القيد — وإن لم نكن الشريك المناسب، فسنقول ذلك أيضاً. |

**New key count: 99 EN + 99 AR.** Parity must pass before merge (file currently 296/296 → 395/395, minus deprecations in §7.1).

---

## 3. Behaviour

### 3.1 Solution cards
- Three cards, all visible, no tabs. Equal visual weight — no "recommended" badge, no highlighted middle card. Equal weight is what communicates "these are paths, not tiers."
- Scale Infrastructure card carries a distinct **Always included** block above the expandable components, visually separated. This is the inheritance signal and it must be legible without expanding anything.
- Price block: `Starting from` + `<span dir="ltr">$X</span>`, then `priceNote1` and `priceNote2` in small text.
- Foundation card ends with `solutions.foundation.note`, then `solutions.foundation.credit` in a visually distinct strip. The credit is the single strongest reason to start at Foundation now that nothing forces it — it does not get buried in body text.

### 3.2 Custom Transformation
Full-width band beneath the three cards, visually different from them — not a fourth card, not in the grid. No price figure, no "What's included" list. Single CTA: Book a strategy call.

### 3.3 Router
- Six options, single-select, no submit button.
- On selection: render `resultLabel` + solution name + reason, then `scrollIntoView` on the matching card with a highlight state (~2s) and a scroll offset for the sticky header. q6 scrolls to the Custom Transformation band.
- Re-selectable; clears the previous highlight.
- Fire GA4 `router_select` with the chosen option and recommended solution. This is the cheapest read you'll get on where traffic self-identifies, and it feeds Phase 2 pricing directly.

### 3.4 Deep links
`#foundation`, `#growth-engine`, `#scale-infrastructure`, `#custom` scroll to and highlight the matching block.

---

## 4. Mobile

**Hard rule for this build and everything after: nothing is removed at mobile widths to solve a layout problem.** Accordions are allowed. `hidden md:block` on content is not.

| Element | Mobile behaviour |
|---|---|
| Hero | H1 lead/accent stack; both CTAs full-width stacked, primary first |
| Problem recognition | Five items stacked, full width, generous line height. This section is the emotional hook — it does not get compressed |
| Router | Six full-width stacked buttons, min 44px tap height |
| Router result | Scroll offset accounts for the sticky header |
| Solution cards | Single column, full width |
| Foundation credit strip | Never collapsed |
| "What's included" | Accordion, collapsed by default. Tagline, Best for, Problem, Outcome, and price always visible |
| Scale "Always included" | Never collapsed — it carries the inheritance logic |
| Price block | Never collapsed, never truncated |
| Custom Transformation | Full-width band, body text intact |
| How we work | Strategy block full width, three capability cards stacked below |
| FAQ | Accordion, all collapsed |
| Repeated CTA | One additional "Book a strategy call" after the Custom Transformation band. No sticky bottom bar — the WhatsApp float already holds that corner |

**Two existing mobile regressions fixed in this phase** (both currently desktop-only per the audit):
1. Footer newsletter form — a lead capture element invisible to mobile traffic.
2. Footer location/contact column.

### 4.1 RTL
- Solution names wrapped `<span dir="ltr">` so they don't reorder mid-sentence in Arabic.
- Prices and currency symbols wrapped `dir="ltr"`.
- Any horizontal chevron or arrow mirrors in RTL. Accordion chevrons mirror.
- Test the H1 lead/accent split at Arabic string lengths — the pattern exists but the line break lands differently.
- The problem-recognition checkmarks sit on the right in RTL.

---

## 5. Taxonomy — `shared/taxonomy.ts`

Display labels change. **Slugs do not.**

| Slug (unchanged) | Old label | New label | Arabic |
|---|---|---|---|
| `ai-training` | AI Training | AI Enablement | تمكين الذكاء الاصطناعي |
| `digital-marketing` | Digital Marketing | Marketing Systems | أنظمة التسويق |
| `software` | Software | Business Technology | تقنية الأعمال |

Portfolio **category** labels (`business-systems`, `web`, `mobile`, `automation`, `digital-marketing`, `ai-training`) are a separate set and stay as they are. `?service=<pillar>` deep links keep working.

### 5.1 SEO handling
The search terms live where search actually reads them, not in the nav:

| Page | H1 | Meta title |
|---|---|---|
| `/services/ai-training` | AI Enablement and team AI training | AI Training & Enablement for Business Teams — OmniflowAI |
| `/services/digital-marketing` | Marketing Systems: SEO, paid, and conversion | Digital Marketing Systems — SEO, Paid & Conversion — OmniflowAI |
| `/services/software` | Business Technology: software, ERP, CRM, and automation | Software Development, ERP & CRM Systems — OmniflowAI |

Slugs unchanged, so no redirects, no lost index. Clean labels in nav, footer, and cards; keyword-rich H1s and titles on the pages themselves.

---

## 6. Downstream changes

| Location | Change |
|---|---|
| Header nav | `"Services"` → `"Solutions"` / `"الحلول"`. `href` stays `/services` |
| Footer, Services column | Three links relabelled. `href`s unchanged |
| Homepage pillar cards | Labels + body updated to the new capability names |
| Homepage system map | Node labels updated. Screen-reader description updated to match |
| Homepage pillars heading | `"Three capabilities. One transformation partner."` is now orphaned language from a page that no longer uses it. Rewrite, or it becomes the next copy-drift problem |
| `/services/ai-training` | Purchase framing removed. Reframed as "how AI Enablement works inside a solution." CTA → `/services` |
| `/services/digital-marketing`, `/services/software` | Structure kept. CTAs → `/services` so buying intent funnels through the solutions page |
| Contact form dropdown | Options: Foundation · Growth Engine · Scale Infrastructure · Custom Transformation · Not sure yet. **Default changes from "Software" to "Not sure yet"** — the current pre-selection silently biases every lead record |
| SEO tab title | `"Solutions — OmniflowAI"` |

---

## 7. Migration of old keys

### 7.1 Deprecate, don't delete
The `services.*` set (audit §2.5) is marked deprecated in `i18n.tsx` with a comment block and left in place through this deploy. Nothing new references it.

**Removal is ticketed in this same phase, not "later."** The audit already found two divergent copy sets for the same three pillars because a previous cleanup never happened. Condition for removal: `/services` live and verified in both languages, and a grep confirming zero `services.*` references outside the deprecated block.

### 7.2 Deprecated keys
Eyebrow, H1 lead/accent, subhead, three pillar tab labels, three panel blocks (title, tagline, body), three four-step arrays, four old pain-router strings.

---

## 8. Solution detail pages — Phase 1b

Not built here. Defined so `detailLink` has a destination and the URL scheme is settled before anything ships.

```
/services/foundation
/services/growth-engine
/services/scale-infrastructure
```

Custom Transformation gets **no page** — it's an exception path, and a page would turn it into the fourth product you specifically decided against.

Shared template: Hero (name, tagline, price floor) → Who this is for → The problem in detail → What's included, expanded per component → How it runs (phases, rough duration) → What you get at the end (concrete artefacts) → **What this does not include** → Related work → FAQ → CTA.

"What this does not include" is deliberate. It makes the honesty positioning legible instead of asserted, and it pre-empts the scope conversation that otherwise happens on the call.

---

## 9. Build order

1. Add 96 EN + 96 AR keys, verify parity
2. Mark old `services.*` keys deprecated, open the removal ticket
3. Build `/services` sections 1–9
4. Taxonomy label change + downstream label updates (§6)
5. Capability page H1/meta rewrites (§5.1) + CTA redirects
6. Contact form options + default change
7. Fix the two footer mobile regressions
8. Mobile + RTL pass against §4 on real devices, not a resized browser
9. Deploy to Replit dev — verify which `DATABASE_URL` the instance reads before touching content

---

## 10. Open items

1. **Three price floors.** Copy is written; numbers are placeholders. Phase 2 decision. If they don't land before ship, cards read `Pricing on request` / `السعر عند الطلب` rather than a fake number.
2. ~~Foundation fee credit~~ — **resolved.** Credited toward implementation when the project starts within 90 days and is based on that diagnosis. Framed as a credit, never a refund: the client bought a roadmap and keeps it either way. Needs a matching clause in the proposal template so the website and the contract say the same thing.
3. **Phase 1b timing** — detail pages before or after the Pricing page.

---

## 11. Changes from v1

| Area | v1 | v2 |
|---|---|---|
| Model | Strict external ladder | Constraint-based paths, ladder internal only |
| Foundation promise | "Build the foundation" | "Discover what's blocking growth" — diagnosis only |
| Scale inheritance | Full Growth Engine scope | Visibility layer always, rest by diagnosis |
| Strategy | Fourth card | Framing band above three capabilities |
| Fourth path | None | Custom Transformation, band not card |
| Page order | Cards before router | Problem recognition → router → cards |
| Router | 4 options | 6 options, revised q2, new "not sure" and "doesn't fit" |
| Old keys | Deleted | Deprecated + ticketed removal |
| SEO | Label change only | Keyword-rich H1s and meta on capability pages |
| External noun | "Engagement" | "Solution" |

### 11.1 Applied after v2 review

| Change | Detail |
|---|---|
| Foundation credit | Fee credited toward implementation started within 90 days and based on that diagnosis. Credit, never refund. New key + FAQ item. |
| Router q6 | "Our situation doesn't fit any of these" → "We have a unique challenge that needs a tailored approach." Qualification framing, not exclusion. |
| Custom eyebrow | "Need something different?" → "Does your situation not fit a common pattern?" |
| "Diagnosis" | Now consistently "business diagnosis" in customer-facing copy. The bare noun read as "a meeting." |

---

# 12. v2.1 addendum — experience layer

Applied after the visual review. Information architecture and §0 decisions are unchanged. These are additions and copy revisions only. Where a key below conflicts with §2, **this section wins**.

## 12.1 Revised keys

| Key | English | Arabic |
|---|---|---|
| `solutions.hero.secondary` | Find your constraint | حدّد القيد لديك |
| `solutions.router.eyebrow` | Business diagnostic | تشخيص الأعمال |
| `solutions.router.heading` | Find your growth constraint. | حدّد القيد الذي يعيق نموك. |
| `solutions.router.sub` | Pick what sounds closest to your business. We'll point you to the right starting point. | اختر ما يقترب أكثر من وضع أعمالك، وسنوجّهك إلى نقطة البداية المناسبة. |
| `solutions.custom.eyebrow` | The escape hatch | المسار الاستثنائي |
| `solutions.custom.heading` | Not every business fits a pattern. | ليست كل الأعمال تناسبها الأنماط الجاهزة. |
| `solutions.custom.body` | Strong sales with broken operations. AI adoption across every department at once. A combination no standard scope covers. When the business diagnosis points somewhere none of the three fit, the answer isn't a package — it's a system designed around your reality. | مبيعات قوية مع عمليات مكسورة. تبنٍّ للذكاء الاصطناعي عبر كل الأقسام دفعة واحدة. تركيبة لا يغطّيها أي نطاق جاهز. حين يشير تشخيص الأعمال إلى ما لا يناسبه أيٌّ من الثلاثة، فالإجابة ليست باقة — بل نظام مصمَّم حول واقعك. |

`solutions.custom.name` and `solutions.custom.price` are unchanged. `solutions.custom.composed` is retained but moves into the Custom Transformation detail copy, not the band.

## 12.2 New keys — solution statements

Each card now leads with the problem in the client's words. This replaces `tagline`, `bestFor`, and `problem` in the **collapsed** card view; all three remain in the accordion and on the Phase 1b detail pages.

| Key | English | Arabic |
|---|---|---|
| `solutions.foundation.statement` | You know growth is stuck. You don't yet know why. | تعرف أن النمو متوقّف، لكنك لا تعرف السبب بعد. |
| `solutions.foundation.outcomeShort` | Find the constraint before spending on solutions. | حدّد القيد قبل الإنفاق على الحلول. |
| `solutions.growth.statement` | You have demand. Growth is unpredictable. | لديك طلب. لكن النمو غير قابل للتوقّع. |
| `solutions.growth.outcomeShort` | Build a measurable acquisition system your team runs with AI. | ابنِ نظام استقطاب قابلاً للقياس يديره فريقك بالذكاء الاصطناعي. |
| `solutions.scale.statement` | Your business has outgrown the systems running it. | أعمالك تجاوزت الأنظمة التي تديرها. |
| `solutions.scale.outcomeShort` | Build the operating infrastructure for scale. | ابنِ البنية التشغيلية اللازمة للتوسّع. |
| `solutions.grid.outcomeLabel` | Outcome | النتيجة |

## 12.3 New keys — trust strip

Sits directly below the hero, above the problem section.

| Key | English | Arabic |
|---|---|---|
| `solutions.trust.label` | Trusted by brands across the US, the GCC and Egypt | موثوقون من علاماتٍ تجارية في الولايات المتحدة ودول الخليج ومصر |

Stat values reuse the existing homepage trust-strip keys. **No new numbers are invented.** If a figure on the homepage is not defensible, it is corrected there first — it does not get copied onto this page. Compact stats only; the 32-logo wall stays on the homepage.

## 12.4 New keys — the shift

Sits below the five problem statements.

| Key | English | Arabic |
|---|---|---|
| `solutions.shift.nowLabel` | What you're running on | ما تعمل به الآن |
| `solutions.shift.now1` | Founder judgement | تقدير المؤسّس |
| `solutions.shift.now2` | More people | مزيد من الموظفين |
| `solutions.shift.now3` | Manual handoffs | تسليم يدوي |
| `solutions.shift.now4` | Spreadsheets | جداول بيانات |
| `solutions.shift.now5` | A ceiling | سقف لا يُتجاوز |
| `solutions.shift.arrow` | Diagnosis | التشخيص |
| `solutions.shift.nextLabel` | What it becomes | ما الذي تصبح عليه |
| `solutions.shift.next1` | Defined process | عملية محدّدة |
| `solutions.shift.next2` | Automation | أتمتة |
| `solutions.shift.next3` | Connected data | بيانات مترابطة |
| `solutions.shift.next4` | Visibility | رؤية واضحة |
| `solutions.shift.next5` | Scale | توسّع |

**Revised key count: 118 EN + 118 AR.**

## 12.5 Revised section order

```
1  Hero                    + system visual, two-column
2  Trust strip             ← new
3  Problem recognition     + display-type pains, before/after shift
4  Diagnostic router       + numbered 01–06
5  The three solutions     + statement-led cards, details collapsed
6  Custom Transformation   + full-contrast inversion
7  How we work
8  Proof
9  FAQ
10 Final CTA
```

## 12.6 Visual treatment rules

- **Surface rhythm alternates** between the two darkest surfaces section by section, so scrolling has cadence. Custom Transformation is the single inverted section — accent background, dark text.
- **Card glyphs** are hexagon line-art marks, stroke only, no fill. They mark the three solutions and the three capabilities. No other iconography on the page.
- **Router selected state** is the only accent fill in its section.
- **The credit strip is the only non-accent highlight on the page.**
- **Hero animation runs once on load** — connector paths draw in over ~2.5s. Not looping, not scroll-triggered. Must respect `prefers-reduced-motion`.
- Permitted: two radial accent glows (hero, final CTA). Not permitted: additional colours, illustration, stock photography, gradients elsewhere.

## 12.7 Numerals

Western numerals (0–9) in both languages, including the router indices and all prices. Eastern Arabic numerals were tested and rejected: the audience reads Western numerals fine in professional contexts, and mixing them with currency figures in the same card is inconsistent.
