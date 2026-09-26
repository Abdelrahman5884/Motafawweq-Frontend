// Learnora Mock Data Engine — Egyptian Curriculum & SaaS Context

export const MOCK_LESSON = {
  id: 'les-bio-301',
  title: 'Photosynthesis & Energy Dynamics in Plant Cells',
  titleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
  subject: 'Biology',
  subjectAr: 'الأحياء - الثانوية العامة',
  grade: '3rd Secondary (Thanawya Amma)',
  gradeAr: 'الصف الثالث الثانوي',
  unit: 'Unit 1: Structure & Function in Living Organisms',
  unitAr: 'الوحدة الأولى: التركيب والوظيفة في الكائنات الحية',
  description: 'Comprehensive high school biology lecture covering chloroplast anatomy, light-dependent reactions on thylakoids, Melvin Calvin cycle, and Thanawya Amma trap questions.',
  descriptionAr: 'شرح مفصل ومكثف لدرس البناء الضوئي للصف الثالث الثانوي: تركيب البلاستيدة، التفاعلات الضوئية واللاضوئية، دورة كالفن، وأهم أسئلة ومصائد امتحانات الثانوية العامة مع ملازم الشرح وصور السبورة المرتبة.',
  videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
  videoSourceType: 'embed',
  videoFileName: 'Photosynthesis_Masterclass_2026.mp4',
  attachments: {
    pdfs: [
      {
        id: 'pdf-1',
        title: 'مذكرة شرح البناء الضوئي والتفاعلات الضوئية - د. سلمى',
        fileName: 'Photosynthesis_Full_Notes_2026.pdf',
        fileSize: '4.8 MB',
        pagesCount: 24,
        url: '#'
      },
      {
        id: 'pdf-2',
        title: 'شيت تدريبات بنك الأسئلة والوزارة 2026',
        fileName: 'Biology_Ministry_Bank_Questions.pdf',
        fileSize: '2.3 MB',
        pagesCount: 16,
        url: '#'
      },
      {
        id: 'pdf-3',
        title: 'ملخص المعادلات ومخططات دورة كالفن',
        fileName: 'Calvin_Cycle_Equations_Summary.pdf',
        fileSize: '1.1 MB',
        pagesCount: 6,
        url: '#'
      }
    ],
    images: [
      {
        id: 'img-1',
        order: 1,
        title: 'سبورة 1: التركيب التشريحي للبلاستيدة وأقراص الثيلاكويد',
        fileName: 'whiteboard_part1_chloroplast.jpg',
        fileSize: '1.8 MB',
        url: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop&q=80',
        caption: 'رسم توضيحي تفصيلي لغشاء الثيلاكويد وحبيبات الجرانا والستروما'
      },
      {
        id: 'img-2',
        order: 2,
        title: 'سبورة 2: مسار الإلكترونات والفسفرة الضوئية',
        fileName: 'whiteboard_part2_photophosphorylation.jpg',
        fileSize: '2.1 MB',
        url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
        caption: 'شرح حركة الإلكترونات بين نظام الصبغيات الأول والثاني'
      },
      {
        id: 'img-3',
        order: 3,
        title: 'سبورة 3: دورة كالفن وتثبيت مركب PGAL',
        fileName: 'whiteboard_part3_calvin_cycle.jpg',
        fileSize: '1.9 MB',
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
        caption: 'خطوات تثبيت ثاني أكسيد الكربون وإنتاج السكر'
      }
    ]
  },
  durationSeconds: 2538, // 42m 18s
  durationFormatted: '42:18',
  recordedDate: '2026-09-12',
  teacher: {
    id: 'tch-salma',
    name: 'Dr. Salma El-Sayed',
    nameAr: 'د. سلمى السيد',
    title: 'Senior Biology Lecturer & Author',
    titleAr: 'كبير معلمي الأحياء ومؤلف سلسلة التفوق',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    studentsCount: 3840
  },
  stats: {
    conceptsCount: 14,
    chaptersCount: 5,
    quizQuestionsCount: 12,
    completionRate: 88,
    avgQuizScore: 84.5,
    activeStudents: 248
  },
  chapters: [
    { id: 'ch-1', title: 'Chloroplast Structure & Pigment Systems', titleAr: 'تركيب البلاستيدة الخضراء وأجهزة الأصباغ', timestamp: '00:00', startSeconds: 0 },
    { id: 'ch-2', title: 'Light Reactions & Photolysis of Water', titleAr: 'التفاعلات الضوئية وانشطار جزيء الماء', timestamp: '05:20', startSeconds: 320 },
    { id: 'ch-3', title: 'Dark Reactions: Calvin Cycle & RuBisCO', titleAr: 'التفاعلات اللاضوئية: دورة كالفن وإنزيم روبيسكو', timestamp: '14:45', startSeconds: 885 },
    { id: 'ch-4', title: 'Limiting Factors of Photosynthesis', titleAr: 'العوامل المحددة لسرعة البناء الضوئي', timestamp: '26:10', startSeconds: 1570 },
    { id: 'ch-5', title: 'ATP Yield & Thanawya Amma Exam Traps', titleAr: 'إنتاج الطاقة ومصائد امتحانات الثانوية العامة', timestamp: '35:00', startSeconds: 2100 }
  ],
  transcript: [
    {
      id: 'tr-1',
      startSeconds: 0,
      timestamp: '00:00',
      speaker: 'Dr. Salma',
      text: 'Good evening everyone! Welcome to our core session on Photosynthesis for Thanawya Amma 2026.',
      textAr: 'مساء الخير يا شباب وبنات دفعة 2026! أهلاً بكم في أقوى حصة لشرح وتفكيك آلية البناء الضوئي في النبات.'
    },
    {
      id: 'tr-2',
      startSeconds: 45,
      timestamp: '00:45',
      speaker: 'Dr. Salma',
      text: 'Remember our golden rule: photosynthesis is not just turning carbon dioxide and water into glucose. It is an intricate thermodynamic conversion of photon energy into high-energy chemical bonds.',
      textAr: 'تذكروا قاعدتنا الذهبية دائماً: البناء الضوئي مش مجرد معادلة CO2 وماية يتحولوا لجلوكوز. دي عملية تحويل كهروديناميكية معقدة لطاقة الفوتونات إلى روابط كيميائية عالية الطاقة.'
    },
    {
      id: 'tr-3',
      startSeconds: 140,
      timestamp: '02:20',
      speaker: 'Dr. Salma',
      text: 'Let us zoom into the double-membraned organelle: the Chloroplast. Inside, note the thylakoid discs stacked neatly into Grana, surrounded by the fluid matrix called the Stroma.',
      textAr: 'تعالوا نعمل زووم على البلاستيدة الخضراء: غشاء مزدوج يحيط بكتل أقراص الثيلاكويد المرتبة في حبيبات الجرانا، والوسط السائل اللي اسمه الستروما أو النخاع.'
    },
    {
      id: 'tr-4',
      startSeconds: 320,
      timestamp: '05:20',
      speaker: 'Dr. Salma',
      text: 'Now Chapter 2: The Light-Dependent reactions. This happens specifically on the Thylakoid membrane where Chlorophyll A is activated by photons of 680nm and 700nm wavelength.',
      textAr: 'ندخل في التفاعلات الضوئية: بتحدث تحديداً على أغشية الثيلاكويد، حيث يمتص كلوروفيل (أ) الفوتونات الضوئية فتكتسب إلكتروناته طاقة وتصبح في حالة إثارة.'
    },
    {
      id: 'tr-5',
      startSeconds: 490,
      timestamp: '08:10',
      speaker: 'Dr. Salma',
      text: 'Critical Thanawya question: What is the origin of oxygen gas released? Van Niel experimentally proved using sulfur bacteria that water (H2O), not CO2, is the true donor of oxygen.',
      textAr: 'سؤال امتحان متكرر: ما هو مصدر الأكسجين المتصاعد؟ العالم فان نيل أثبت باستخدام بكتيريا الكبريت أن الماء H2O وليس ثاني أكسيد الكربون هو مصدر الأكسجين الناتج.'
    },
    {
      id: 'tr-6',
      startSeconds: 680,
      timestamp: '11:20',
      speaker: 'Dr. Salma',
      text: 'Notice how NADP+ acts as the hydrogen taxi. It picks up the 2 protons and 2 electrons from photolysis to form NADPH, preventing hydrogen from escaping.',
      textAr: 'ركزوا في دور مركب NADP+: هو تاكسي الهيدروجين في النبات، بيستقبل أيونات الهيدروجين الناتجة من انشطار الماء ويتحول إلى NADPH عشان يمنع رجوعه واتحاده مع الأكسجين.'
    },
    {
      id: 'tr-7',
      startSeconds: 885,
      timestamp: '14:45',
      speaker: 'Dr. Salma',
      text: 'Chapter 3: The Calvin Cycle in the Stroma. This is light-independent. Melvin Calvin used Chlorella algae and radioactive Carbon-14 to discover PGAL (Phosphoglyceraldehyde).',
      textAr: 'الفصل الثالث: التفاعلات اللاضوئية في الستروما. ملفين كالفين استخدم طحلب الكلوريلا والكربون المشع C14 وأثبت أن أول مركب كيميائي ثابت ناتج هو فوسفو جليسرالدهيد (PGAL).'
    },
    {
      id: 'tr-8',
      startSeconds: 1140,
      timestamp: '19:00',
      speaker: 'Dr. Salma',
      text: 'PGAL is a 3-carbon compound. Two PGAL molecules join to build 1 molecule of Glucose (C6H12O6). It can also be transformed into lipids and proteins.',
      textAr: 'مركب PGAL ثلاثي الكربون. عشان نكون جزيء واحد من سكر الجلوكوز C6H12O6 بنحتاج جزيئين PGAL، والنبات بيستخدمه كمان في بناء الدهون والبروتينات.'
    },
    {
      id: 'tr-9',
      startSeconds: 1570,
      timestamp: '26:10',
      speaker: 'Dr. Salma',
      text: 'Chapter 4: Blackman Law of Limiting Factors. If temperature, light, and CO2 are all present, the rate is determined by the factor closest to its minimum value.',
      textAr: 'الفصل الرابع: قانون العوامل المحددة لبلاكمان. سرعة العملية بيحكمها العامل الأقل توافراً أو الأقرب لقيمته الصغرى سواء درجة الحرارة أو الضوء أو تركيز ثاني أكسيد الكربون.'
    },
    {
      id: 'tr-10',
      startSeconds: 2100,
      timestamp: '35:00',
      speaker: 'Dr. Salma',
      text: 'Summary and test questions: Watch out for the trick asking whether Calvin cycle occurs in darkness only. No! It occurs day and night as long as NADPH and ATP are available.',
      textAr: 'تنبيه امتحاني خطير: هل دورة كالفن بتحدث في الظلام فقط؟ إطلاقاً! بتحدث نهاراً وليلاً في الستروما بشرط توافر مركبَي الطاقة التثبيتية NADPH و ATP.'
    }
  ],
  summary: {
    overview: 'This comprehensive lesson explores the physiological, chemical, and organelle-level mechanics of photosynthesis. It breaks down the conversion of radiant solar energy into chemical energy, contrasting the photochemical reactions within the grana thylakoids against the enzymatic carbon fixation occurring in the stroma.',
    overviewAr: 'تشرح هذه الحصة تفصيلياً الآليات الفسيولوجية والكيميائية لعملية البناء الضوئي، مع التركيز على تحويل الطاقة الضوئية إلى روابط كيميائية، والمقارنة الدقيقة بين التفاعلات الضوئية في أقراص الثيلاكويد والتفاعلات اللاضوئية التثبيتية في الستروما.',
    keyDefinitions: [
      { term: 'Thylakoid Membrane', termAr: 'غشاء الثيلاكويد', def: 'Phospholipid bilayer embedded with Photosystems I & II, ATP synthase, and electron transport carriers where photolysis occurs.', defAr: 'غشاء بروتيني دهني يحتوي على أجهزة الصبغيات ومعقدات إنتاج ATP وحوامل الإلكترونات حيث يتم انشطار الماء.' },
      { term: 'Photophosphorylation', termAr: 'الفسفرة الضوئية', def: 'The synthesis of ATP from ADP and inorganic phosphate using energy captured from activated chlorophyll electrons.', defAr: 'تكوين جزيئات ATP من ADP والفوسفات باستخدام الطاقة المنطلقة من إلكترونات الكلوروفيل المثار.' },
      { term: 'PGAL (Phosphoglyceraldehyde)', termAr: 'مركب PGAL', def: 'The first stable 3-carbon organic intermediate discovered by Melvin Calvin in the dark reaction pathway.', defAr: 'أول مركب كيميائي ثلاثي الكربون ثابت ينتج من التفاعلات اللاضوئية بعد ثانيتين فقط من التعريض للضوء.' },
      { term: 'Assimilatory Power', termAr: 'مركبا الطاقة التثبيتية', def: 'The pair of molecules (ATP and NADPH) produced during light reactions and consumed in the stroma to reduce CO2.', defAr: 'هما مركبَا ATP و NADPH الناتجان من التفاعلات الضوئية واللازمان لاختزال غاز CO2 في الستروما.' }
    ],
    keyFormulas: [
      { label: 'Overall Reaction', formula: '6CO2 + 12H2O + Light Energy ➔ C6H12O6 + 6H2O + 6O2' },
      { label: 'Photolysis Step', formula: '2H2O + Light + Chlorophyll ➔ 4H+ + 4e- + O2↑' },
      { label: 'Hydrogen Reduction', formula: 'NADP+ + 2H+ + 2e- ➔ NADPH + H+' }
    ],
    takeaways: [
      'Van Niel proved with purple sulfur bacteria that H2O is the sole source of released oxygen gas.',
      'Chlorophyll A and B peak in absorption at Blue and Red spectral wavelengths; green is reflected.',
      'Calvin cycle requires 18 ATP and 12 NADPH molecules to synthesize one molecule of Glucose.',
      'Blackman Law states the rate of photosynthesis is governed by the factor present at minimum intensity.'
    ],
    takeawaysAr: [
      'أثبت العالم فان نيل بتجربة بكتيريا الكبريت أن مصدر الأكسجين هو الماء وليس ثاني أكسيد الكربون.',
      'يمتص الكلوروفيل أ و ب الضوء الأزرق والأحمر بأعلى كفاءة، بينما يعكس الضوء الأخضر.',
      'دورة كالفن تحتاج 18 جزيء ATP و 12 جزيء NADPH لتكوين جزيء جلوكوز كامل.',
      'قانون بلاكمان يحدد أن سرعة البناء الضوئي تتوقف على العامل الأقرب إلى الحد الأدنى.'
    ]
  },
  notebookMindMap: {
    id: 'bio-root',
    label: 'Photosynthesis & Energy Dynamics',
    labelAr: 'البناء الضوئي وحركية الطاقة في النبات',
    timestamp: '00:00',
    seconds: 0,
    summaryAr: 'العملية الحيوية الأساسية لتحويل الطاقة الضوئية إلى طاقة كيميائية في الروابط العضوية داخل البلاستيدات الخضراء.',
    children: [
      {
        id: 'bio-chloro',
        label: 'Chloroplast Structure',
        labelAr: 'تركيب البلاستيدة الخضراء (Chloroplast)',
        timestamp: '02:20',
        seconds: 140,
        summaryAr: 'غشاء مزدوج يحيط بكتل أقراص الثيلاكويد المرتبة في حبيبات الجرانا وحشوة الستروما السائلة.',
        children: [
          {
            id: 'bio-grana',
            label: 'Grana & Thylakoid Discs',
            labelAr: 'حبيبات الجرانا وأقراص الثيلاكويد',
            timestamp: '03:15',
            seconds: 195,
            summaryAr: 'أقراص غشائية متراصة تحتوي على أنظمة الصبغيات ومسارات نقل الإلكترونات لانشطار الماء.',
            children: [
              {
                id: 'bio-pigments',
                label: 'Pigment Complexes',
                labelAr: 'أجهزة الأصباغ (كلوروفيل أ وب)',
                timestamp: '04:00',
                seconds: 240,
                summaryAr: 'تمتص طاقة فوتونات الضوء الأزرق والأحمر بكفاءة عظمى وتعكس الأخضر.'
              },
              {
                id: 'bio-atp-synth',
                label: 'ATP Synthase Complex',
                labelAr: 'معقد إنزيم بناء ATP',
                timestamp: '04:45',
                seconds: 285,
                summaryAr: 'يستغل التدرج البروتوني عبر غشاء الثيلاكويد لتخليق جزيئات ATP من ADP والفوسفات.'
              }
            ]
          },
          {
            id: 'bio-stroma',
            label: 'Stroma Matrix',
            labelAr: 'حشوة الستروما (النخاع)',
            timestamp: '05:00',
            seconds: 300,
            summaryAr: 'الوسط البروتيني السائل المحتوي على إنزيمات دورة كالفن وريبوسومات وجزيئات DNA البلاستيدة.'
          }
        ]
      },
      {
        id: 'bio-light',
        label: 'Light-Dependent Reactions',
        labelAr: 'التفاعلات الضوئية (Light Reactions)',
        timestamp: '05:20',
        seconds: 320,
        summaryAr: 'تحدث على أغشية الثيلاكويد حيث يمتص الكلوروفيل الفوتونات الضوئية فتكتسب إلكتروناته طاقة وتصبح في حالة إثارة.',
        children: [
          {
            id: 'bio-photolysis',
            label: 'Photolysis of Water',
            labelAr: 'انشطار جزيء الماء ضوئياً',
            timestamp: '08:10',
            seconds: 490,
            summaryAr: 'أثبت فان نيل أن الماء وليس ثاني أكسيد الكربون هو مصدر الأكسجين المتصاعد O2.',
            children: [
              {
                id: 'bio-oxygen-source',
                label: 'Van Niel Experiment',
                labelAr: 'تجربة فان نيل وبكتيريا الكبريت O18',
                timestamp: '09:30',
                seconds: 570,
                summaryAr: 'استخدم نظائر الأكسجين المشعة لإثبات أن الماء هو المانح الحقيقي للإلكترونات والبروتونات.'
              }
            ]
          },
          {
            id: 'bio-nadph',
            label: 'NADP+ Reduction',
            labelAr: 'اختزال مرافق الإنزيم NADP+',
            timestamp: '11:20',
            seconds: 680,
            summaryAr: 'تاكسي الهيدروجين الذي يستقبل الإلكترونات والبروتونات ليتحول إلى NADPH ويمنع هروب الهيدروجين.'
          },
          {
            id: 'bio-photophosphorylation',
            label: 'Photophosphorylation',
            labelAr: 'الفسفرة الضوئية لتوليد ATP',
            timestamp: '13:00',
            seconds: 780,
            summaryAr: 'تخزين الطاقة المتحررة من هبوط الإلكترونات المثارة في روابط جزيئات ATP.'
          }
        ]
      },
      {
        id: 'bio-dark',
        label: 'Calvin Cycle (Dark Reactions)',
        labelAr: 'التفاعلات اللاضوئية (دورة كالفن)',
        timestamp: '14:45',
        seconds: 885,
        summaryAr: 'تحدث في الستروما ليلاً ونهاراً بشرط توافر مركبَي الطاقة التثبيتية ATP و NADPH لاختزال غاز CO2.',
        children: [
          {
            id: 'bio-rubisco',
            label: 'RuBisCO Enzyme',
            labelAr: 'إنزيم روبيسكو RuBisCO وتثبيت CO2',
            timestamp: '16:30',
            seconds: 990,
            summaryAr: 'الإنزيم المسؤول عن ربط غاز ثاني أكسيد الكربون بسكر ريبولوز ثنائي الفوسفات.'
          },
          {
            id: 'bio-pgal',
            label: 'PGAL Compound Formation',
            labelAr: 'تكوين مركب PGAL ثلاثي الكربون',
            timestamp: '19:00',
            seconds: 1140,
            summaryAr: 'أول مركب كيميائي ثابت ناتج؛ يلزم جزيئان منه لتكوين جزيء جلوكوز كامل.',
            children: [
              {
                id: 'bio-glucose-synthesis',
                label: 'Glucose Synthesis',
                labelAr: 'بناء الجلوكوز والنشا والدهون',
                timestamp: '22:15',
                seconds: 1335,
                summaryAr: 'يتحول PGAL عبر مسارات أيضية في السيتوبلازم إلى جلوكوز وأحماض أمينية وأحماض دهنية.'
              }
            ]
          }
        ]
      },
      {
        id: 'bio-factors',
        label: 'Limiting Factors (Blackman)',
        labelAr: 'العوامل المحددة (قانون بلاكمان)',
        timestamp: '26:10',
        seconds: 1570,
        summaryAr: 'سرعة البناء الضوئي تتوقف على العامل الأقرب إلى حده الأدنى سواء الضوء أو الحرارة أو CO2.',
        children: [
          {
            id: 'bio-light-intensity',
            label: 'Light Intensity Factor',
            labelAr: 'تأثير شدة الضوء ونقطة التشبع',
            timestamp: '28:40',
            seconds: 1720,
            summaryAr: 'يزداد معدل البناء الضوئي بزيادة الضوء حتى الوصول لنقطة التشبع الضوئي.'
          },
          {
            id: 'bio-temp-factor',
            label: 'Temperature & Enzymes',
            labelAr: 'تأثير درجة الحرارة على الإنزيمات',
            timestamp: '31:20',
            seconds: 1880,
            summaryAr: 'تؤثر الحرارة بشكل مباشر على التفاعلات اللاضوئية الإنزيمية في الستروما.'
          }
        ]
      },
      {
        id: 'bio-exam-traps',
        label: 'Thanawya Exam Traps',
        labelAr: 'مصائد امتحانات الثانوية العامة',
        timestamp: '35:00',
        seconds: 2100,
        summaryAr: 'أهم التريكات والأسئلة الخادعة التي يقع فيها طلاب الثانوية العامة في امتحانات الوزارة.',
        children: [
          {
            id: 'bio-trap-darkness',
            label: 'Does Calvin Cycle need darkness?',
            labelAr: 'هل تحدث دورة كالفن في الظلام فقط؟',
            timestamp: '37:10',
            seconds: 2230,
            summaryAr: 'خطأ شائع! دورة كالفن تحدث نهاراً وليلاً ما دامت نواتج التفاعلات الضوئية متوافرة.'
          },
          {
            id: 'bio-trap-isotopes',
            label: 'Tracing Oxygen-18 Isotope',
            labelAr: 'تتبع نظير الأكسجين المشع O18',
            timestamp: '39:40',
            seconds: 2380,
            summaryAr: 'إذا كان الماء يحتوي على O18، فإن الأكسجين المتصاعد O2 هو الذي يحتوي على الإشعاع حصراً.'
          }
        ]
      }
    ]
  },
  knowledgeMap: {
    centerConcept: 'Photosynthesis (البناء الضوئي)',
    nodes: [
      {
        id: 'node-root',
        label: 'Photosynthesis',
        labelAr: 'عملية البناء الضوئي',
        category: 'core',
        x: 450,
        y: 250,
        level: 0,
        timestamp: '00:45',
        seconds: 45,
        mastery: 92,
        quizCount: 12,
        summary: 'Thermodynamic conversion of photon radiation into biochemical bond energy inside plant chloroplasts.',
        summaryAr: 'العملية الحيوية الأساسية لتحويل الطاقة الضوئية إلى طاقة كيميائية في الروابط العضوية.'
      },
      {
        id: 'node-chloro',
        label: 'Chloroplast Anatomy',
        labelAr: 'تركيب البلاستيدة',
        category: 'structure',
        x: 230,
        y: 130,
        level: 1,
        timestamp: '02:20',
        seconds: 140,
        mastery: 89,
        quizCount: 3,
        summary: 'Double membrane, Grana stacks, fluid Stroma, and lipid droplets facilitating energy capture.',
        summaryAr: 'الغشاء المزدوج، حبيبات الجرانا، وسط الستروما وحبيبات النشا.'
      },
      {
        id: 'node-pigments',
        label: 'Photosynthetic Pigments',
        labelAr: 'الأصباغ الأساسية والمساعدة',
        category: 'structure',
        x: 100,
        y: 210,
        level: 2,
        timestamp: '03:40',
        seconds: 220,
        mastery: 84,
        quizCount: 2,
        summary: 'Chlorophyll A (70%), Chlorophyll B, Carotenoids, and Xanthophylls optimizing photon absorption.',
        summaryAr: 'كلوروفيل أ (70%)، كلوروفيل ب، الكاروتين والزانثوفيل.'
      },
      {
        id: 'node-light',
        label: 'Light-Dependent Reactions',
        labelAr: 'التفاعلات الضوئية',
        category: 'process',
        x: 280,
        y: 380,
        level: 1,
        timestamp: '05:20',
        seconds: 320,
        mastery: 78,
        quizCount: 4,
        summary: 'Occurs in Thylakoid membranes; includes water photolysis, NADP+ reduction, and ATP synthesis.',
        summaryAr: 'تحدث في أقراص الثيلاكويد وتشمل انشطار الماء واختزال NADP+ وإنتاج ATP.'
      },
      {
        id: 'node-photolysis',
        label: 'Water Photolysis',
        labelAr: 'انشطار الماء',
        category: 'process',
        x: 150,
        y: 470,
        level: 2,
        timestamp: '08:10',
        seconds: 490,
        mastery: 82,
        quizCount: 2,
        summary: 'Splitting of H2O releasing free O2 gas into the atmosphere and supplying electrons to Photosystem II.',
        summaryAr: 'شطر جزيء الماء إلى بروتونات وإلكترونات وانطلاق غاز الأكسجين كناتج ثانوي.'
      },
      {
        id: 'node-nadph',
        label: 'NADP+ & ATP Synthesis',
        labelAr: 'مركبا الطاقة التثبيتية',
        category: 'energy',
        x: 360,
        y: 490,
        level: 2,
        timestamp: '11:20',
        seconds: 680,
        mastery: 71, // Weak area!
        quizCount: 3,
        summary: 'NADP+ captures hydrogen to become NADPH; ADP is photophosphorylated into high-energy ATP.',
        summaryAr: 'تثبيت الهيدروجين في مركب NADPH والفسفرة الضوئية لإنتاج ATP.'
      },
      {
        id: 'node-dark',
        label: 'Calvin Cycle (Dark Rxns)',
        labelAr: 'دورة كالفن (التفاعلات اللاضوئية)',
        category: 'process',
        x: 670,
        y: 150,
        level: 1,
        timestamp: '14:45',
        seconds: 885,
        mastery: 64, // Weak area!
        quizCount: 4,
        summary: 'Occurs in Stroma; enzymatic carbon fixation using ATP and NADPH to reduce CO2.',
        summaryAr: 'تحدث في الستروما بالاعتماد على إنزيمات حيوية لاختزال ثاني أكسيد الكربون.'
      },
      {
        id: 'node-pgal',
        label: 'PGAL Synthesis',
        labelAr: 'تكوين فوسفو جليسرالدهيد PGAL',
        category: 'biochem',
        x: 820,
        y: 240,
        level: 2,
        timestamp: '19:00',
        seconds: 1140,
        mastery: 68,
        quizCount: 2,
        summary: 'First stable 3-carbon intermediate; two molecules condense into Glucose or convert to fats/amino acids.',
        summaryAr: 'أول مركب ثلاثي الكربون ثابت كيميائياً، يتحد جزيئان منه لتكوين الجلوكوز.'
      },
      {
        id: 'node-factors',
        label: 'Limiting Factors (Blackman)',
        labelAr: 'العوامل المحددة (قانون بلاكمان)',
        category: 'ecology',
        x: 630,
        y: 380,
        level: 1,
        timestamp: '26:10',
        seconds: 1570,
        mastery: 86,
        quizCount: 2,
        summary: 'Law of Limiting Factors: Temperature controls enzymes; light controls electron excitation; CO2 availability.',
        summaryAr: 'تأثير درجة الحرارة على الإنزيمات والضوء على إثارة الكلوروفيل وتركيز CO2.'
      }
    ],
    links: [
      { from: 'node-root', to: 'node-chloro', label: 'takes place in' },
      { from: 'node-chloro', to: 'node-pigments', label: 'contains' },
      { from: 'node-root', to: 'node-light', label: 'stage 1' },
      { from: 'node-light', to: 'node-photolysis', label: 'initiates' },
      { from: 'node-light', to: 'node-nadph', label: 'generates' },
      { from: 'node-root', to: 'node-dark', label: 'stage 2' },
      { from: 'node-nadph', to: 'node-dark', label: 'powers' },
      { from: 'node-dark', to: 'node-pgal', label: 'synthesizes' },
      { from: 'node-root', to: 'node-factors', label: 'governed by' }
    ]
  },
  quizzes: [
    {
      id: 'q-1',
      question: 'Which of the following represents the exact source of oxygen gas (O2) evolved during green plant photosynthesis?',
      questionAr: 'ما هو المصدر المباشر لغاز الأكسجين المتصاعد أثناء عملية البناء الضوئي في النباتات الخضراء؟',
      type: 'mcq',
      difficulty: 'Easy',
      conceptId: 'node-photolysis',
      timestamp: '08:10',
      options: [
        'Carbon dioxide gas (CO2)',
        'Water molecules (H2O)',
        'Phosphoglyceraldehyde (PGAL)',
        'Atmospheric ozone breakdown'
      ],
      optionsAr: [
        'غاز ثاني أكسيد الكربون (CO2)',
        'جزيئات الماء (H2O)',
        'مركب فوسفو جليسرالدهيد (PGAL)',
        'تحلل الأوزون الجوي'
      ],
      correctIndex: 1,
      explanation: 'Experimental evidence provided by Van Niel using sulfur bacteria, later confirmed with oxygen-18 isotope, proved that H2O undergoes photolysis, releasing O2 gas.',
      explanationAr: 'أثبت العالم فان نيل باستخدام بكتيريا الكبريت الخضراء، وتأكد ذلك باستخدام نظير الأكسجين O18، أن انشطار الماء الضوئي هو مصدر الأكسجين.'
    },
    {
      id: 'q-2',
      question: 'What is the primary role of NADP+ during the light-dependent reactions on the thylakoid membrane?',
      questionAr: 'ما هو الدور الأساسي لمركب NADP+ أثناء التفاعلات الضوئية على أغشية الثيلاكويد؟',
      type: 'mcq',
      difficulty: 'Medium',
      conceptId: 'node-nadph',
      timestamp: '11:20',
      options: [
        'Directly catalyzes carbon fixation in the stroma',
        'Acts as a proton and electron acceptor, forming NADPH to prevent hydrogen loss',
        'Breaks down glucose into two pyruvic acid molecules',
        'Reflects excess green light wavelengths'
      ],
      optionsAr: [
        'تحفيز تثبيت الكربون في الستروما بشكل مباشر',
        'استقبال البروتونات والإلكترونات الناتجة من انشطار الماء لمنع هروب الهيدروجين',
        'شطر جزيء الجلوكوز إلى حمضين بيروفيك',
        'عكس أشعة الضوء الأخضر الزائدة'
      ],
      correctIndex: 1,
      explanation: 'NADP+ acts as a specialized coenzyme hydrogen carrier. It bonds with H+ and electrons from photolyzed water to prevent explosive recombination with oxygen.',
      explanationAr: 'يعمل NADP+ كمستقبل هيدروجين لحمله إلى الستروما ومنع اتحاده مرة أخرى مع الأكسجين الناتج.'
    },
    {
      id: 'q-3',
      question: 'Melvin Calvin used radioactive Carbon-14 and Chlorella algae to demonstrate that the first stable chemical product is:',
      questionAr: 'أثبت ملفين كالفين باستخدام نظير الكربون C14 وطحلب الكلوريلا أن أول مركب كيميائي ثابت ناتج هو:',
      type: 'mcq',
      difficulty: 'Medium',
      conceptId: 'node-pgal',
      timestamp: '14:45',
      options: [
        'Glucose (6-Carbon hexose)',
        'Sucrose',
        'Phosphoglyceraldehyde (PGAL, 3-Carbon)',
        'Ribulose bisphosphate (RuBP)'
      ],
      optionsAr: [
        'سكر الجلوكوز (سداسي الكربون)',
        'سكر السكروز',
        'فوسفو جليسرالدهيد (PGAL ثلاثي الكربون)',
        'سكر ريبولوز ثنائي الفوسفات'
      ],
      correctIndex: 2,
      explanation: 'After exposing Chlorella algae to light for just 2 seconds, Calvin isolated PGAL, proving glucose is not built in a single direct step.',
      explanationAr: 'بعد تعريض الطحلب للضوء لمدة ثانيتين فقط تم فصل مركب PGAL ثلاثي الكربون، مما يثبت أن الجلوكوز لا يتكون في خطوة واحدة مفاجئة.'
    },
    {
      id: 'q-4',
      question: 'True or False: The Calvin cycle reactions can proceed normally in complete darkness over an extended period of 48 hours without light.',
      questionAr: 'صح أم خطأ: يمكن لدورة كالفن أن تستمر في العمل بكفاءة تامة داخل الظلام التام لمدة 48 ساعة متواصلة.',
      type: 'true_false',
      difficulty: 'Hard',
      conceptId: 'node-dark',
      timestamp: '35:00',
      options: [
        'True — It is called the dark reaction and does not need sunlight directly.',
        'False — It rapidly halts once the stored supply of ATP and NADPH from light reactions is exhausted.'
      ],
      optionsAr: [
        'صواب — لأنها تفاعلات لاضوئية ولا تحتاج إلى الضوء.',
        'خطأ — لأنها تتوقف سريعاً بمجرد نفاد مخزون مركبَي الطاقة التثبيتية ATP و NADPH الناتجة من التفاعلات الضوئية.'
      ],
      correctIndex: 1,
      explanation: 'Even though Calvin cycle enzymes do not require photons directly, they depend entirely on the assimilatory power (ATP & NADPH) generated exclusively during light illumination.',
      explanationAr: 'على الرغم من أنها تفاعلات لا تعتمد مباشرة على الضوء، إلا أنها تشترط توافر ATP و NADPH الناتجة من الضوء، فإذا استمر الظلام ينفد المخزون وتتوقف الدورة.'
    }
  ]
};

export const ALL_PUBLISHED_LESSONS = [
  {
    id: 'les-bio-301',
    title: 'Photosynthesis & Energy Dynamics in Plant Cells',
    titleAr: 'البناء الضوئي وحركية الطاقة في الخلايا النباتية',
    subject: 'Biology',
    subjectAr: 'الأحياء - الثانوية العامة',
    gradeAr: 'الصف الثالث الثانوي',
    unitAr: 'الوحدة الأولى: التركيب والوظيفة في الكائنات الحية',
    mediaType: 'video',
    durationFormatted: '42:18',
    durationSeconds: 2538,
    recordedDate: '2026-09-12',
    videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    videoSourceType: 'embed',
    descriptionAr: 'شرح مفصل ومكثف لدرس البناء الضوئي للصف الثالث الثانوي: تركيب البلاستيدة، التفاعلات الضوئية واللاضوئية، دورة كالفن، وأهم أسئلة ومصائد امتحانات الثانوية العامة مع ملازم الشرح وصور السبورة المرتبة.',
    stats: {
      conceptsCount: 14,
      chaptersCount: 5,
      quizQuestionsCount: 12,
      completionRate: 88,
      avgQuizScore: 84.5
    },
    chapters: MOCK_LESSON.chapters,
    transcript: MOCK_LESSON.transcript,
    attachments: MOCK_LESSON.attachments,
    notebookMindMap: MOCK_LESSON.notebookMindMap
  },
  {
    id: 'les-nlp-401',
    title: 'Linguistic Foundations for NLP Algorithms',
    titleAr: 'أساسيات لغوية لخوارزميات معالجة اللغة الطبيعية (NLP)',
    subject: 'Computer Science & AI',
    subjectAr: 'علوم الحاسب والذكاء الاصطناعي',
    gradeAr: 'المستوى الجامعي المتقدم',
    unitAr: 'خوارزميات معالجة اللغات الطبيعية',
    mediaType: 'video',
    durationFormatted: '45:10',
    durationSeconds: 2710,
    recordedDate: '2026-09-18',
    videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    videoSourceType: 'embed',
    descriptionAr: 'محاضرة مفصلة حول الأساسيات اللغوية لبناء خوارزميات معالجة اللغة الطبيعية، وتصميم المدونات اللغوية (Corpus)، وأشجار التحليل النحوي، وبناء المحلل الصرفي للغة العربية وقواعد إزالة كلمات التوقف.',
    stats: {
      conceptsCount: 18,
      chaptersCount: 4,
      quizQuestionsCount: 15,
      completionRate: 94,
      avgQuizScore: 89.2
    },
    chapters: [
      { id: 'ch-nlp-1', title: 'Introduction to Linguistic Corpora', titleAr: 'مقدمة عن المدونات اللغوية (Corpus)', timestamp: '00:00', startSeconds: 0 },
      { id: 'ch-nlp-2', title: 'Syntactic Parsing & Grammar', titleAr: 'التحليل النحوي وأشجار الإعراب (Parsing)', timestamp: '12:00', startSeconds: 720 },
      { id: 'ch-nlp-3', title: 'Morphological Analysis in Arabic', titleAr: 'بناء محلل صرفي للغة العربية', timestamp: '21:00', startSeconds: 1260 },
      { id: 'ch-nlp-4', title: 'Stop Word Removal Techniques', titleAr: 'استراتيجيات إزالة كلمات التوقف', timestamp: '30:00', startSeconds: 1800 }
    ],
    transcript: [
      { id: 'tr-nlp-1', startSeconds: 0, timestamp: '00:00', speaker: 'د. سلمى', textAr: 'أهلاً بكم في محاضرة اليوم حول الأساسيات اللغوية لخوارزميات معالجة اللغة الطبيعية. سنبدأ بالتعرف على المدوّنة اللغوية أو الكوربس.' },
      { id: 'tr-nlp-2', startSeconds: 190, timestamp: '03:10', speaker: 'د. سلمى', textAr: 'المدونة اللغوية (Corpus) هي مجموعة مهيكلة وضخمة من النصوص الحقيقية تستخدم لتدريب النماذج الإحصائية والعصبية.' },
      { id: 'tr-nlp-3', startSeconds: 720, timestamp: '12:00', speaker: 'د. سلمى', textAr: 'التحليل النحوي أو الـ Parsing يهدف لاكتشاف العلاقات التركيبية وبناء شجرة الإعراب بين مكونات الجملة.' },
      { id: 'tr-nlp-4', startSeconds: 1260, timestamp: '21:00', speaker: 'د. سلمى', textAr: 'في اللغة العربية، نظراً لطبيعتها الاشتقاقية، نحتاج لمحلل صرفي دقيق يحلل الجذور والأوزان والسوابق واللواحق.' },
      { id: 'tr-nlp-5', startSeconds: 1800, timestamp: '30:00', speaker: 'د. سلمى', textAr: 'إزالة كلمات التوقف تساهم في تقليل ضوضاء المتجهات والتركيز على الكلمات المفتاحية الأكثر دلالة.' }
    ],
    attachments: {
      pdfs: [
        { id: 'pdf-nlp-1', title: 'مذكرة معالجة اللغات الطبيعية - د. سلمى', fileName: 'NLP_Linguistics_Foundations_2026.pdf', fileSize: '5.2 MB', pagesCount: 32, url: '#' },
        { id: 'pdf-nlp-2', title: 'شيت تدريبات استخراج الكلمات المفتاحية', fileName: 'Corpus_Parsing_Worksheet.pdf', fileSize: '2.1 MB', pagesCount: 14, url: '#' }
      ],
      images: [
        { id: 'img-nlp-1', order: 1, title: 'سبورة 1: مخطط معمارية المدونة اللغوية', fileName: 'nlp_corpus_architecture.jpg', fileSize: '1.9 MB', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80', caption: 'تصميم هيكل البيانات للمدونة' }
      ]
    },
    notebookMindMap: {
      id: 'nlp-root',
      labelAr: 'أساسيات لغوية لخوارزميات معالجة اللغة الطبيعية',
      label: 'Linguistic Foundations for NLP Algorithms',
      timestamp: '00:00',
      seconds: 0,
      summaryAr: 'المفاهيم اللغوية التأسيسية لتطوير خوارزميات معالجة وفهم اللغات الطبيعية.',
      children: [
        {
          id: 'nlp-corpus',
          labelAr: 'المدوّنة (Corpus)',
          label: 'Corpus',
          timestamp: '03:10',
          seconds: 190,
          summaryAr: 'مجموعة نصوص حقيقية مهيكلة لتدريب النماذج.',
          children: [
            { id: 'nlp-def', labelAr: 'التعريف', label: 'Definition', timestamp: '04:00', seconds: 240, summaryAr: 'مجموعة معيارية من النصوص ممثلة للغة أو تخصص معين.' },
            { id: 'nlp-design', labelAr: 'عناصر التصميم الرئيسية', label: 'Key Design Elements', timestamp: '06:20', seconds: 380, summaryAr: 'التمثيلية، التوازن، حجم البيانات، ودقة التوسيم النحوي.' },
            { id: 'nlp-types', labelAr: 'أنواع المدونات', label: 'Types of Corpora', timestamp: '08:45', seconds: 525, summaryAr: 'مدونات عامة، متخصصة، ثنائية اللغة ومتوازية.' }
          ]
        },
        {
          id: 'nlp-parsing',
          labelAr: 'التحليل النحوي (Parsing)',
          label: 'Parsing',
          timestamp: '12:00',
          seconds: 720,
          summaryAr: 'تفكيك الجمل واكتشاف العلاقات التركيبية بين الكلمات.',
          children: [
            { id: 'nlp-parse-tree', labelAr: 'أشجار الإعراب التوليدية', label: 'Constituency Trees', timestamp: '14:15', seconds: 855, summaryAr: 'تمثيل الجملة في هيكل هرمي من المركبات الاسمية والفعلية.' },
            { id: 'nlp-dep', labelAr: 'التبعيات النحوية (Dependency)', label: 'Dependency Grammar', timestamp: '17:30', seconds: 1050, summaryAr: 'ربط الكلمات مباشرة بروابط نحوية موجهة (فاعل، مفعول).' }
          ]
        },
        {
          id: 'nlp-morph',
          labelAr: 'بناء محلل صرفي (Morphological Analyzer)',
          label: 'Morphological Analyzer',
          timestamp: '21:00',
          seconds: 1260,
          summaryAr: 'تحليل بنية الكلمة العربية إلى الجذر والوزن والزوائد.',
          children: [
            { id: 'nlp-stemming', labelAr: 'التجذير والاشتقاق (Stemming)', label: 'Stemming & Lemmatization', timestamp: '23:40', seconds: 1420, summaryAr: 'إرجاع الكلمة إلى أصلها المعجمي أو جذرها الثلاثي.' },
            { id: 'nlp-affix', labelAr: 'تحليل الزوائد والسوابق واللواحق', label: 'Affix Analysis', timestamp: '26:10', seconds: 1570, summaryAr: 'التعرف على حروف الجر والضمائر المتصلة وحروف العطف.' }
          ]
        },
        {
          id: 'nlp-stop',
          labelAr: 'إزالة كلمات التوقف (Stop Word Removal)',
          label: 'Stop Word Removal',
          timestamp: '30:00',
          seconds: 1800,
          summaryAr: 'تصفية الكلمات الوظيفية الشائعة التي لا تحمل معنى دلالياً مؤثراً.',
          children: [
            { id: 'nlp-freq', labelAr: 'قوائم التكرار العالي', label: 'High Frequency Lists', timestamp: '32:15', seconds: 1935, summaryAr: 'حروف الجر وأسماء الإشارة والضمائر المنفصلة.' },
            { id: 'nlp-domain', labelAr: 'تصفية الكلمات الخاصة بالسياق', label: 'Domain Specific Filtering', timestamp: '34:50', seconds: 2090, summaryAr: 'استبعاد الكلمات المكررة في نطاق علمي محدد.' }
          ]
        }
      ]
    }
  },
  {
    id: 'les-bio-302',
    title: 'Cellular Respiration & Krebs Cycle',
    titleAr: 'التنفس الخلوي الهوائي ودورة كريبس',
    subject: 'Biology',
    subjectAr: 'الأحياء - الثانوية العامة',
    gradeAr: 'الصف الثالث الثانوي',
    unitAr: 'الوحدة الأولى: التركيب والوظيفة في الكائنات الحية',
    mediaType: 'audio',
    durationFormatted: '38:40',
    durationSeconds: 2320,
    recordedDate: '2026-09-08',
    descriptionAr: 'شرح تفكيك جزيء الجلوكوز، وانشطار الجلوكوز في السيتوبلازم، وتفاعلات أكسدة حمض البيروفيك داخل الميتوكوندريا، ودورة كريبس وسلسلة نقل الإلكترون.',
    stats: { conceptsCount: 16, chaptersCount: 3, quizQuestionsCount: 14, completionRate: 91, avgQuizScore: 82.0 },
    chapters: [
      { id: 'ch-resp-1', title: 'Glycolysis in Cytoplasm', titleAr: 'انشطار الجلوكوز في السيتوبلازم', timestamp: '00:00', startSeconds: 0 },
      { id: 'ch-resp-2', title: 'Krebs Cycle Matrix', titleAr: 'دورة كريبس في الميتوكوندريا', timestamp: '12:20', startSeconds: 740 },
      { id: 'ch-resp-3', title: 'Electron Transport Chain', titleAr: 'سلسلة نقل الإلكترون وإنتاج 38 ATP', timestamp: '24:10', startSeconds: 1450 }
    ],
    transcript: [
      { id: 'tr-resp-1', startSeconds: 0, timestamp: '00:00', speaker: 'د. سلمى', textAr: 'مساء الخير يا أبطال. اليوم نستكمل رحلة الطاقة مع التنفس الخلوي الهوائي داخل الخلية.' }
    ],
    attachments: { pdfs: [], images: [] },
    notebookMindMap: {
      id: 'resp-root',
      labelAr: 'التنفس الخلوي الهوائي وإنتاج الطاقة',
      label: 'Cellular Respiration',
      timestamp: '00:00',
      seconds: 0,
      summaryAr: 'أكسدة الروابط العضوية لاستخراج الطاقة المخزونة في صورة 38 جزيء ATP.',
      children: [
        {
          id: 'resp-glyco',
          labelAr: 'انشطار الجلوكوز (Glycolysis)',
          label: 'Glycolysis',
          timestamp: '02:00',
          seconds: 120,
          children: [
            { id: 'resp-glyco-loc', labelAr: 'يحدث في السيتوسول الخلوي', timestamp: '03:10', seconds: 190 },
            { id: 'resp-glyco-atp', labelAr: 'الناتج الصافي: 2 ATP و 2 NADH', timestamp: '06:00', seconds: 360 }
          ]
        },
        {
          id: 'resp-krebs',
          labelAr: 'دورة كريبس (حمض الستريك)',
          label: 'Krebs Cycle',
          timestamp: '12:20',
          seconds: 740,
          children: [
            { id: 'resp-krebs-loc', labelAr: 'تحدث في حشوة الميتوكوندريا', timestamp: '14:00', seconds: 840 },
            { id: 'resp-krebs-yield', labelAr: 'النواتج لكل جزيء جلوكوز (دورتان)', timestamp: '18:30', seconds: 1110 }
          ]
        },
        {
          id: 'resp-etc',
          labelAr: 'سلسلة نقل الإلكترون',
          label: 'Electron Transport Chain',
          timestamp: '24:10',
          seconds: 1450,
          children: [
            { id: 'resp-etc-cyto', labelAr: 'السيتوكرومات على الغشاء الداخلي', timestamp: '27:00', seconds: 1620 },
            { id: 'resp-etc-oxygen', labelAr: 'الأكسجين هو المستقبل الأخير للإلكترونات', timestamp: '31:00', seconds: 1860 }
          ]
        }
      ]
    }
  },
  {
    id: 'les-bio-303',
    title: 'Molecular Genetics & DNA Replication',
    titleAr: 'البيولوجيا الجزيئية وتضاعف الحمض النووي DNA',
    subject: 'Biology',
    subjectAr: 'الأحياء - الثانوية العامة',
    gradeAr: 'الصف الثالث الثانوي',
    unitAr: 'الوحدة الثانية: البيولوجيا الجزيئية',
    mediaType: 'video',
    durationFormatted: '51:15',
    durationSeconds: 3075,
    recordedDate: '2026-09-02',
    videoUrl: 'https://www.youtube.com/watch?v=sQK3Yr4Sc_k',
    videoSourceType: 'embed',
    descriptionAr: 'شرح تفصيلي لتجارب إثبات المادة الوراثية، وتركيب لولب واطسون وكريك المزدوج، وإنزيمات تضاعف الـ DNA (اللولب، البلمرة، والربط).',
    stats: { conceptsCount: 22, chaptersCount: 3, quizQuestionsCount: 16, completionRate: 78, avgQuizScore: 79.5 },
    chapters: [
      { id: 'ch-dna-1', title: 'DNA as Genetic Material', titleAr: 'أدلة إثبات أن DNA هو المادة الوراثية', timestamp: '00:00', startSeconds: 0 },
      { id: 'ch-dna-2', title: 'Watson & Crick Double Helix', titleAr: 'نموذج واطسون وكريك للولب المزدوج', timestamp: '15:20', startSeconds: 920 },
      { id: 'ch-dna-3', title: 'Replication Enzymes', titleAr: 'إنزيمات تضاعف DNA وإصلاح العيوب', timestamp: '30:40', startSeconds: 1840 }
    ],
    transcript: [
      { id: 'tr-dna-1', startSeconds: 0, timestamp: '00:00', speaker: 'د. سلمى', textAr: 'أهلاً بكم في أصعب وأمتع وحدات الثانوية العامة: البيولوجيا الجزيئية وتركيب الـ DNA.' }
    ],
    attachments: { pdfs: [], images: [] },
    notebookMindMap: {
      id: 'dna-root',
      labelAr: 'البيولوجيا الجزيئية وتركيب الـ DNA',
      label: 'Molecular Genetics',
      timestamp: '00:00',
      seconds: 0,
      summaryAr: 'دراسة الأساس الكيميائي والوراثي للمعلومات الجينية وتضاعفها.',
      children: [
        {
          id: 'dna-evidence',
          labelAr: 'أدلة إثبات المادة الوراثية',
          timestamp: '03:00',
          seconds: 180,
          children: [
            { id: 'dna-grif', labelAr: 'تجربة جريفث في التحول البكتيري', timestamp: '05:00', seconds: 300 },
            { id: 'dna-hersh', labelAr: 'تجربة هيرشي وتشيس بالبلعوم البكتيري', timestamp: '10:00', seconds: 600 }
          ]
        },
        {
          id: 'dna-structure',
          labelAr: 'التركيب الجزيئي للولب المزدوج',
          timestamp: '15:20',
          seconds: 920,
          children: [
            { id: 'dna-nucleotide', labelAr: 'النيوكليوتيدة والقواعد النيتروجينية', timestamp: '18:00', seconds: 1080 },
            { id: 'dna-bonds', labelAr: 'الروابط الهيدروجينية والتكاملية A=T و G≡C', timestamp: '22:00', seconds: 1320 }
          ]
        },
        {
          id: 'dna-enzymes',
          labelAr: 'إنزيمات التضاعف والإصلاح',
          timestamp: '30:40',
          seconds: 1840,
          children: [
            { id: 'dna-helicase', labelAr: 'إنزيم اللولب (فصل الشريطين)', timestamp: '33:00', seconds: 1980 },
            { id: 'dna-poly', labelAr: 'إنزيم بلمرة DNA (البناء في اتجاه 5 إلى 3)', timestamp: '37:00', seconds: 2220 },
            { id: 'dna-ligase', labelAr: 'إنزيم الربط (ربط قطع أوكازاكي)', timestamp: '42:00', seconds: 2520 }
          ]
        }
      ]
    }
  }
];

export const MOCK_CLASSES = [
  {
    id: 'cls-1',
    name: 'Thanawya Amma Biology 2026 — Dokki Elite Hall',
    nameAr: 'أحياء 3 ثانوي 2026 — مجموعة الدقي النخبة',
    grade: 'Grade 12',
    gradeAr: 'الصف الثالث الثانوي',
    subject: 'Biology',
    subjectAr: 'الأحياء',
    enrolledStudents: 148,
    capacity: 150,
    priceEgp: 450,
    schedule: 'Sundays & Wednesdays 4:00 PM',
    scheduleAr: 'الأحد والأربعاء 4:00 عصراً',
    joinCode: 'BIO-DK-2026',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=LEARNORA-CLASS-BIO-DK-2026',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    attendanceRate: 94.2,
    avgScore: 86.8
  },
  {
    id: 'cls-2',
    name: '3rd Secondary Physics Olympiad & Problem Solving',
    nameAr: 'فيزياء الثانوية العامة — بنك أفكار كيرشوف والدينامو',
    grade: 'Grade 12',
    gradeAr: 'الصف الثالث الثانوي',
    subject: 'Physics',
    subjectAr: 'الفيزياء',
    enrolledStudents: 120,
    capacity: 130,
    priceEgp: 500,
    schedule: 'Mondays & Thursdays 6:00 PM',
    scheduleAr: 'الإثنين والخميس 6:00 مساءً',
    joinCode: 'PHY-OLYMP-26',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=LEARNORA-CLASS-PHY-OLYMP-26',
    coverImage: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    attendanceRate: 91.5,
    avgScore: 82.1
  },
  {
    id: 'cls-3',
    name: 'Grade 11 Biology Foundation & Human Physiology',
    nameAr: 'أحياء ثانية ثانوي — التغذية والنقل في الكائنات الحية',
    grade: 'Grade 11',
    gradeAr: 'الصف الثاني الثانوي',
    subject: 'Biology',
    subjectAr: 'الأحياء',
    enrolledStudents: 85,
    capacity: 100,
    priceEgp: 380,
    schedule: 'Tuesdays 5:00 PM',
    scheduleAr: 'الثلاثاء 5:00 مساءً',
    joinCode: 'BIO-G11-FND',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=LEARNORA-CLASS-BIO-G11-FND',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    attendanceRate: 96.0,
    avgScore: 89.4
  }
];

export const MOCK_STUDENTS = [
  {
    id: 'std-1',
    name: 'Omar Tarek El-Kady',
    nameAr: 'عمر طارق القاضي',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    phone: '+20 102 458 9912',
    parentName: 'Eng. Tarek El-Kady',
    parentNameAr: 'م. طارق القاضي',
    parentPhone: '+20 100 123 4567',
    attendanceRate: 96.4,
    avgQuizScore: 91.2,
    homeworkRate: 95.0,
    streakDays: 14,
    xpPoints: 2150,
    weakArea: 'Calvin Cycle Dark Rxns (64%)',
    weakAreaAr: 'دورة كالفن والتفاعلات اللاضوئية (64%)',
    status: 'Excellence'
  },
  {
    id: 'std-2',
    name: 'Sarah Khaled Mansour',
    nameAr: 'سارة خالد منصور',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    phone: '+20 111 876 5432',
    parentName: 'Dr. Khaled Mansour',
    parentNameAr: 'د. خالد منصور',
    parentPhone: '+20 122 987 6543',
    attendanceRate: 98.0,
    avgQuizScore: 95.8,
    homeworkRate: 100.0,
    streakDays: 21,
    xpPoints: 3400,
    weakArea: 'Photophosphorylation Yield (72%)',
    weakAreaAr: 'حسابات طاقة الفسفرة الضوئية (72%)',
    status: 'Top 1%'
  },
  {
    id: 'std-3',
    name: 'Kareem Mostafa Badawi',
    nameAr: 'كريم مصطفى بدوي',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    phone: '+20 106 332 1980',
    parentName: 'Mostafa Badawi',
    parentNameAr: 'أ. مصطفى بدوي',
    parentPhone: '+20 106 554 4332',
    attendanceRate: 82.5,
    avgQuizScore: 68.0,
    homeworkRate: 70.0,
    streakDays: 3,
    xpPoints: 920,
    weakArea: 'Chloroplast Anatomy (58%)',
    weakAreaAr: 'أغشية الثيلاكويد والجرانا (58%)',
    status: 'Needs Support'
  },
  {
    id: 'std-4',
    name: 'Mariam Adel Shenouda',
    nameAr: 'مريم عادل شنودة',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    phone: '+20 120 445 7789',
    parentName: 'Adel Shenouda',
    parentNameAr: 'أ. عادل شنودة',
    parentPhone: '+20 122 334 5566',
    attendanceRate: 92.0,
    avgQuizScore: 87.5,
    homeworkRate: 90.0,
    streakDays: 9,
    xpPoints: 1740,
    weakArea: 'Limiting Factors Graph (70%)',
    weakAreaAr: 'منحنيات العوامل المحددة (70%)',
    status: 'Good'
  }
];

export const MOCK_TEACHER_EARNINGS = {
  totalRevenueEgp: 168400,
  pendingPayoutEgp: 24600,
  withdrawnEgp: 143800,
  platformFeeRate: '8%',
  aiMinutesRemaining: 184,
  aiMinutesTotalQuota: 300,
  transactions: [
    { id: 'tx-101', date: '2026-09-14', description: 'Student Subscriptions: Dokki Elite Hall (Sept)', amountEgp: 66600, status: 'Paid' },
    { id: 'tx-102', date: '2026-09-08', description: 'Course Pack Purchase: Genetics Mastery', amountEgp: 18200, status: 'Paid' },
    { id: 'tx-103', date: '2026-09-01', description: 'Bank Transfer to CIB Account ending 9012', amountEgp: -45000, status: 'Completed' },
    { id: 'tx-104', date: '2026-08-28', description: 'Student Subscriptions: G11 Foundation (Aug)', amountEgp: 32300, status: 'Paid' }
  ]
};

export const MOCK_CENTER_DATA = {
  name: 'Al-Rowad Educational Academy',
  nameAr: 'أكاديمية الرواد التعليمية',
  branches: ['Dokki (Main)', 'Nasr City (Branch 2)', 'Smouha (Alexandria)'],
  totalTeachers: 12,
  totalStudents: 1420,
  activeClasses: 28,
  monthlyRevenueEgp: 485000,
  avgAttendanceRate: 93.8,
  branding: {
    primaryColor: '#1588C7',
    accentColor: '#5CB6DB',
    logoText: 'Al-Rowad / الرواد',
    customDomain: 'alrowad.learnora.me'
  }
};

export const MOCK_ADMIN_ECONOMICS = {
  mrrEgp: 540000,
  totalUsers: 34800,
  activeTeachers: 1420,
  activeStudents: 31200,
  activeCenters: 48,
  churnRate: '1.4%',
  aiEconomics: {
    totalAudioMinutesProcessed: 184500,
    aiProcessingCostEgp: 77490, // ~0.42 EGP per minute
    aiRevenueEgp: 295200,
    grossMarginPercent: 73.7,
    avgLessonProcessingSeconds: 38
  },
  verificationQueue: [
    { id: 'req-1', name: 'Mr. Mahmoud Rady', subject: 'Chemistry (3rd Sec)', nationalId: '28910040104921', certificate: 'Faculty of Science, Ain Shams', status: 'Pending Review' },
    { id: 'req-2', name: 'Dr. Hany El-Shennawy', subject: 'Physics', nationalId: '27805120102451', certificate: 'PhD Physics, Cairo University', status: 'Approved' }
  ]
};
