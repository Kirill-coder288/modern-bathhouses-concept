"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

type QuizState = {
  type: "Баня" | "Гостевой дом" | "Баня + гостевой дом";
  area: number;
  material: "Каркас" | "Клеёный брус" | "Газобетон";
  terrace: boolean;
  stove: boolean;
  utilities: boolean;
  region: "Санкт-Петербург" | "До 30 км от КАД" | "30–80 км от КАД" | "80–150 км от КАД";
};

const cases = [
  {
    place: "Репино, Курортный район",
    title: "Баня с гостевой спальней",
    area: "78 м²",
    price: "4,9 млн ₽",
    term: "94 дня",
    year: "2025",
    image: assetPath("/images/case-repino-exterior.webp"),
    tag: "Под ключ",
    quote: "Хотели тёплую баню, которая не выглядит дачным домиком. Получилось именно наше место силы.",
    author: "Алексей и Марина",
  },
  {
    place: "Токсово, Всеволожский район",
    title: "Компактная баня у озера",
    area: "54 м²",
    price: "3,6 млн ₽",
    term: "72 дня",
    year: "2024",
    image: assetPath("/images/case-toksovo.webp"),
    tag: "Под ключ",
    quote: "Смета совпала с итоговой суммой, а стройку закончили на неделю раньше графика.",
    author: "Илья, Токсово",
  },
  {
    place: "Зеленогорск",
    title: "Баня-гостевой дом",
    area: "96 м²",
    price: "6,8 млн ₽",
    term: "118 дней",
    year: "2025",
    image: assetPath("/images/case-zelenogorsk.webp"),
    tag: "Индивидуальный проект",
    quote: "Изменили планировку под наш участок и сохранили панорамный вид на сосны.",
    author: "Ольга и Андрей",
  },
];

const faqs = [
  ["Изменится ли цена во время строительства?", "Нет, стоимость фиксируем в договоре после утверждения проекта и комплектации. Она меняется только если вы сами добавляете работы или материалы после подписания."],
  ["Строите ли вы зимой?", "Да. Каркасные и деревянные конструкции можно собирать круглый год. Мы учитываем сезонность бетонирования, хранения материалов и отделочных работ."],
  ["Можно ли изменить готовый проект?", "Да. Перенесём перегородки, изменим площадь террасы, добавим спальню, санузел или панорамное остекление. Перед стройкой вы получите обновлённые планы и смету."],
  ["Какой фундамент используется?", "Чаще всего — железобетонные сваи или утеплённая плита. Тип фундамента выбираем после осмотра участка и данных о грунте."],
  ["Кто закупает материалы?", "Мы комплектуем объект сами, проверяем партии и отвечаем за доставку. Все основные материалы и работы отражены в смете."],
  ["Есть ли рассрочка?", "Оплата разбита на этапы по графику договора. Для части проектов доступна партнёрская рассрочка — условия рассчитываются индивидуально."],
  ["Работаете ли по Ленинградской области?", "Да, строим в Санкт-Петербурге и по всей Ленинградской области. Для участков дальше 80 км от КАД отдельно считаем логистику."],
  ["Как происходит гарантийное обслуживание?", "Принимаем обращение, согласовываем выезд специалиста и устраняем гарантийный случай в зафиксированный срок. Гарантия на конструктив — до 10 лет."],
];

const gallery = [
  assetPath("/images/case-repino-exterior.webp"),
  assetPath("/images/case-repino-interior.webp"),
  assetPath("/images/case-repino-terrace.webp"),
  assetPath("/images/hero-bathhouse.webp"),
  assetPath("/images/case-toksovo.webp"),
  assetPath("/images/case-zelenogorsk.webp"),
  assetPath("/images/case-repino-interior.webp"),
  assetPath("/images/case-repino-terrace.webp"),
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value);
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quiz, setQuiz] = useState<QuizState>({
    type: "Баня",
    area: 64,
    material: "Каркас",
    terrace: true,
    stove: true,
    utilities: true,
    region: "До 30 км от КАД",
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const galleryTouchStart = useRef<number | null>(null);
  const [demoNotice, setDemoNotice] = useState(false);
  const galleryOpen = galleryIndex !== null;

  useEffect(() => {
    if (!demoNotice) return;

    const timeoutId = window.setTimeout(() => setDemoNotice(false), 5000);
    return () => window.clearTimeout(timeoutId);
  }, [demoNotice]);

  useEffect(() => {
    if (!galleryOpen) return;

    const scrollPosition = window.scrollY;
    const previousBodyStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
    };
    const previousRootOverflow = document.documentElement.style.overflow;
    const previousRootScrollBehavior = document.documentElement.style.scrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGalleryIndex(null);
      if (event.key === "ArrowLeft") {
        setGalleryIndex((current) => current === null ? null : (current + gallery.length - 1) % gallery.length);
      }
      if (event.key === "ArrowRight") {
        setGalleryIndex((current) => current === null ? null : (current + 1) % gallery.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.style.overflow = previousRootOverflow;
      document.body.style.overflow = previousBodyStyles.overflow;
      document.body.style.position = previousBodyStyles.position;
      document.body.style.top = previousBodyStyles.top;
      document.body.style.left = previousBodyStyles.left;
      document.body.style.right = previousBodyStyles.right;
      document.body.style.width = previousBodyStyles.width;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollPosition);
      window.requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = previousRootScrollBehavior;
      });
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [galleryOpen]);

  const estimate = useMemo(() => {
    const typeMultiplier = quiz.type === "Баня" ? 1 : quiz.type === "Гостевой дом" ? 1.08 : 1.16;
    const materialRate = quiz.material === "Каркас" ? 62000 : quiz.material === "Клеёный брус" ? 78000 : 71000;
    const options = (quiz.terrace ? 420000 : 0) + (quiz.stove ? 380000 : 0) + (quiz.utilities ? 560000 : 0);
    const region = quiz.region === "Санкт-Петербург" ? 100000 : quiz.region === "До 30 км от КАД" ? 0 : quiz.region === "30–80 км от КАД" ? 160000 : 310000;
    const middle = Math.max(2900000, Math.round((quiz.area * materialRate * typeMultiplier + options + region) / 50000) * 50000);
    return {
      low: Math.round(middle * 0.94 / 50000) * 50000,
      high: Math.round(middle * 1.08 / 50000) * 50000,
      days: Math.round(55 + quiz.area * 0.55 + (quiz.utilities ? 8 : 0)),
    };
  }, [quiz]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  }

  function showPreviousPhoto() {
    setGalleryIndex((current) => current === null ? null : (current + gallery.length - 1) % gallery.length);
  }

  function showNextPhoto() {
    setGalleryIndex((current) => current === null ? null : (current + 1) % gallery.length);
  }

  function closeGallery() {
    galleryTouchStart.current = null;
    setGalleryIndex(null);
  }

  function finishGallerySwipe(clientX: number) {
    if (galleryTouchStart.current === null) return;

    const distance = galleryTouchStart.current - clientX;
    if (Math.abs(distance) >= 45) {
      if (distance > 0) showNextPhoto();
      else showPreviousPhoto();
    }
    galleryTouchStart.current = null;
  }

  return (
    <main>
      <div className="concept-ribbon"><b>PORTFOLIO CONCEPT</b><span>Вымышленный бренд, объекты и показатели созданы для демонстрации дизайна и интерфейса</span></div>
      <header className="site-header">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="На главную">
          <span className="brand-mark">С</span>
          <span><b>СЕВЕРНАЯ</b><small>ПАРНАЯ</small></span>
        </button>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Основная навигация">
          <button onClick={() => scrollTo("cases")}>Кейсы</button>
          <button onClick={() => scrollTo("packages")}>Комплектации</button>
          <button onClick={() => scrollTo("process")}>Как строим</button>
          <button onClick={() => scrollTo("reviews")}>Отзывы</button>
          <button onClick={() => scrollTo("faq")}>FAQ</button>
        </nav>
        <div className="header-contact concept-contact">
          <b>Концепт лендинга</b>
          <span>Не является сайтом реальной компании</span>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? "×" : "☰"}</button>
      </header>

      <section
        className="hero"
        id="top"
        style={{ backgroundImage: `url("${assetPath("/images/hero-bathhouse.webp")}")` }}
      >
        <div className="hero-shade" />
        <div className="hero-content shell">
          <p className="eyebrow">Портфолио-концепт • Санкт-Петербург</p>
          <h1>Строим современные бани,<br />в которые хочется возвращаться</h1>
          <p className="hero-copy">Проектируем и строим под ключ в Санкт-Петербурге и Ленинградской области — от 2 900 000 ₽.</p>
          <div className="hero-actions">
            <button className="button primary" onClick={() => scrollTo("quiz")}>Рассчитать стоимость</button>
            <button className="button ghost" onClick={() => scrollTo("cases")}>Посмотреть объекты <span>↗</span></button>
          </div>
          <div className="hero-stats" aria-label="Демонстрационные показатели">
            <div><b>47</b><span>объектов построено</span></div>
            <div><b>7 лет</b><span>строим в регионе</span></div>
            <div><b>96%</b><span>объектов сданы в срок</span></div>
            <div><b>10 лет</b><span>гарантия на конструктив</span></div>
          </div>
        </div>
        <span className="hero-note">Проектный образ • Репино, 78 м² • данные вымышлены</span>
      </section>

      <section className="cases section shell" id="cases">
        <div className="section-heading">
          <div><p className="eyebrow copper">Проектные сценарии</p><h2>Примеры объектов</h2></div>
          <p>Демонстрационные кейсы показывают, как компания могла бы раскрывать площадь, сроки и бюджет. Все данные вымышлены.</p>
        </div>

        <article className="featured-case">
          <button className="featured-image" onClick={() => setGalleryIndex(0)} aria-label="Открыть галерею объекта">
            <img src={cases[0].image} alt="Современная баня в Репино" />
            <span className="photo-count">▦ 8 фотографий</span>
          </button>
          <div className="case-info">
            <p className="case-place">01 / {cases[0].place}</p>
            <h3>{cases[0].title}</h3>
            <div className="case-metrics">
              <span><small>Площадь</small><b>{cases[0].area}</b></span>
              <span><small>Стоимость</small><b className="price-number">{cases[0].price}</b></span>
              <span><small>Срок</small><b>{cases[0].term}</b></span>
            </div>
            <blockquote>«{cases[0].quote}»<cite>{cases[0].author}</cite></blockquote>
            <button className="text-link" onClick={() => setGalleryIndex(0)}>Смотреть весь объект <span>→</span></button>
          </div>
        </article>

        <div className="case-grid">
          {cases.slice(1).map((item, index) => (
            <article className="case-card" key={item.place}>
              <button className="case-card-image" onClick={() => setGalleryIndex(index + 3)}>
                <img src={item.image} alt={item.title} />
                <span>{item.tag}</span>
              </button>
              <p>{item.place}</p><h3>{item.title}</h3>
              <div><span>{item.area}</span><span className="price-number">{item.price}</span><span>{item.term}</span></div>
            </article>
          ))}
        </div>
      </section>

      <section className="quiz-section section" id="quiz">
        <div className="shell">
          <div className="section-heading light">
            <div><p className="eyebrow copper">Расчёт за 2 минуты</p><h2>Узнайте бюджет вашей бани</h2></div>
            <p>Ответьте на несколько вопросов — покажем ориентир по стоимости и срокам.</p>
          </div>
          <div className="quiz-card">
            <div className="quiz-progress"><span style={{ width: `${((quizStep + 1) / 6) * 100}%` }} /></div>
            <div className="quiz-top"><span>Шаг {quizStep + 1} из 6</span><span>{Math.round(((quizStep + 1) / 6) * 100)}%</span></div>

            {quizStep === 0 && <div className="quiz-pane"><h3>Что планируете построить?</h3><div className="option-grid three">
              {(["Баня", "Гостевой дом", "Баня + гостевой дом"] as const).map((value) => <button key={value} className={quiz.type === value ? "option active" : "option"} onClick={() => setQuiz({ ...quiz, type: value })}><span>{value === "Баня" ? "♨" : value === "Гостевой дом" ? "⌂" : "⌂ + ♨"}</span><b>{value}</b></button>)}
            </div></div>}

            {quizStep === 1 && <div className="quiz-pane"><h3>Какая нужна площадь?</h3><div className="area-value">{quiz.area} <small>м²</small></div><input className="range" type="range" min="30" max="160" step="2" value={quiz.area} onChange={(e) => setQuiz({ ...quiz, area: Number(e.target.value) })} /><div className="range-labels"><span>30 м²</span><span>160 м²</span></div></div>}

            {quizStep === 2 && <div className="quiz-pane"><h3>Выберите материал стен</h3><div className="option-grid three">
              {(["Каркас", "Клеёный брус", "Газобетон"] as const).map((value) => <button key={value} className={quiz.material === value ? "option active" : "option"} onClick={() => setQuiz({ ...quiz, material: value })}><span>{value === "Каркас" ? "▥" : value === "Клеёный брус" ? "▤" : "▦"}</span><b>{value}</b><small>{value === "Каркас" ? "Тёплый и быстрый" : value === "Клеёный брус" ? "Натуральная фактура" : "Капитальная конструкция"}</small></button>)}
            </div></div>}

            {quizStep === 3 && <div className="quiz-pane"><h3>Что добавить в проект?</h3><div className="toggle-list">
              {[["terrace", "Терраса", "+ от 420 000 ₽"], ["stove", "Печь и дымоход", "+ от 380 000 ₽"], ["utilities", "Внутренние коммуникации", "+ от 560 000 ₽"]].map(([key, label, price]) => { const selected = quiz[key as keyof QuizState] as boolean; return <button key={key} className={selected ? "toggle-row active" : "toggle-row"} onClick={() => setQuiz({ ...quiz, [key]: !selected })}><span className="check">{selected ? "✓" : ""}</span><b>{label}</b><small>{price}</small></button>; })}
            </div></div>}

            {quizStep === 4 && <div className="quiz-pane"><h3>Где находится участок?</h3><div className="option-grid two">
              {(["Санкт-Петербург", "До 30 км от КАД", "30–80 км от КАД", "80–150 км от КАД"] as const).map((value) => <button key={value} className={quiz.region === value ? "option compact active" : "option compact"} onClick={() => setQuiz({ ...quiz, region: value })}><span>⌖</span><b>{value}</b></button>)}
            </div></div>}

            {quizStep === 5 && <div className="quiz-result">
              <div className="result-main"><p className="eyebrow copper">Предварительный расчёт</p><h3 className="price-number">{formatPrice(estimate.low)}–{formatPrice(estimate.high)} ₽</h3><p>Ориентировочный срок строительства: <b>{estimate.days}–{estimate.days + 14} дней</b></p><div className="result-tags"><span>{quiz.type}</span><span>{quiz.area} м²</span><span>{quiz.material}</span></div></div>
              <form className="result-form" onSubmit={(event) => { event.preventDefault(); setDemoNotice(true); }}>
                <><span className="demo-chip">Демо-форма</span><h4>Получите подробную смету</h4><p>В коммерческой версии здесь подключается отправка в Telegram, почту или CRM.</p><input aria-label="Телефон или Telegram" placeholder="Телефон или @telegram" /><button className="button primary" type="button" onClick={() => setDemoNotice(true)}>Показать сценарий отправки</button><small>Данные не сохраняются и никуда не отправляются</small></>
              </form>
            </div>}

            <div className="quiz-actions">
              <button className="button back" disabled={quizStep === 0} onClick={() => setQuizStep(Math.max(0, quizStep - 1))}>← Назад</button>
              {quizStep < 5 && <button className="button primary" onClick={() => setQuizStep(quizStep + 1)}>Далее <span>→</span></button>}
            </div>
          </div>
        </div>
      </section>

      <section className="packages section shell" id="packages">
        <div className="section-heading">
          <div><p className="eyebrow copper">Понятная смета</p><h2>Три комплектации</h2></div>
          <p>Сравните состав работ и выберите подходящую степень готовности.</p>
        </div>
        <div className="package-grid">
          {[
            { n: "01", title: "Тёплый контур", price: "от 42 000 ₽/м²", text: "Основа будущей бани — защищённая от осадков и готовая к инженерным работам.", list: ["Фундамент", "Несущие стены", "Кровля и водостоки", "Энергоэффективные окна", "Входная дверь"] },
            { n: "02", title: "Под отделку", price: "от 58 000 ₽/м²", text: "Все черновые работы выполнены — можно переходить к чистовой отделке.", list: ["Всё из тёплого контура", "Утепление и пароизоляция", "Черновая электрика", "Разводка коммуникаций", "Подготовка помещений"] },
            { n: "03", title: "Под ключ", price: "от 76 000 ₽/м²", text: "Полностью готовая баня: привозите мебель и приглашайте гостей.", list: ["Всё из «под отделку»", "Чистовая отделка", "Сантехника и электрика", "Печь, дымоход и защита", "Освещение и двери"] },
          ].map((p, i) => <article className={i === 2 ? "package featured" : "package"} key={p.title}><div className="package-number">{p.n}</div>{i === 2 && <span className="popular">Популярный выбор</span>}<h3>{p.title}</h3><p>{p.text}</p><h4 className="price-number">{p.price}</h4><ul>{p.list.map((line) => <li key={line}>✓ <span>{line}</span></li>)}</ul><button className={i === 2 ? "button primary" : "button outline"} onClick={() => scrollTo("contact")}>Получить смету</button></article>)}
        </div>
      </section>

      <section className="included section">
        <div className="shell included-wrap">
          <div><p className="eyebrow copper">Без скрытых доплат</p><h2>Что входит в стоимость</h2><p>В расчёте учитываем не только коробку, но и весь процесс до сдачи объекта.</p></div>
          <div className="included-grid">
            {["Выезд инженера и привязка к участку", "Архитектурный и рабочий проект", "Материалы и доставка", "Работа строительной бригады", "Технический надзор", "Вывоз строительного мусора"].map((item, i) => <div key={item}><span>0{i + 1}</span><b>{item}</b></div>)}
          </div>
        </div>
      </section>

      <section className="process section shell" id="process">
        <div className="section-heading"><div><p className="eyebrow copper">От идеи до первой растопки</p><h2>Как проходит строительство</h2></div><p>Вы видите результат каждого этапа и оплачиваете работы по графику.</p></div>
        <div className="timeline">
          {[ ["01", "Знакомство", "Обсуждаем задачи, участок и бюджет"], ["02", "Проект", "Готовим планы, визуализации и смету"], ["03", "Договор", "Фиксируем цену и календарный график"], ["04", "Строительство", "Собираем объект и ведём фотоотчёт"], ["05", "Сдача", "Проверяем, подписываем акт и выдаём гарантию"] ].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="concept-showcase"><img src={assetPath("/images/case-repino-interior.webp")} alt="Интерьер современной парной" /><div><small>Логика концепта</small><b>От вдохновения к расчёту за несколько экранов</b><p>Архитектурная фотография создаёт желание, кейсы отвечают на сомнения, а мини-квиз переводит интерес в понятный бюджет.</p><span>Hero → Кейсы → Калькулятор → Заявка</span></div></div>
      </section>

      <section className="reviews section" id="reviews">
        <div className="shell"><div className="section-heading light"><div><p className="eyebrow copper">Демонстрационные отзывы</p><h2>Сценарии обратной связи</h2></div><p>Пример того, как в реальном проекте можно связать отзыв с объектом. Персонажи и цитаты вымышлены.</p></div>
          <div className="review-grid">
            {cases.map((item, i) => <article key={item.author}><div className="stars">★★★★★</div><blockquote>«{item.quote}»</blockquote><div className="review-author"><span>{item.author.split(" ").map((p) => p[0]).join("").slice(0, 2)}</span><div><b>{item.author}</b><small>{item.place} • объект {item.year}</small></div></div><button onClick={() => setGalleryIndex(i === 0 ? 0 : i + 2)}>Посмотреть объект →</button></article>)}
          </div>
        </div>
      </section>

      <section className="guarantees section shell">
        <div className="guarantee-lead"><b>10</b><span>лет гарантии<br />на конструктив</span></div>
        <div><h2>Отвечаем за результат</h2><p>Собственная техническая служба проверяет скрытые работы и остаётся на связи после сдачи.</p></div>
        <div className="guarantee-list"><span>✓ Фиксируем сроки в договоре</span><span>✓ Фотоотчёт на каждом этапе</span><span>✓ Гарантийные выезды по регламенту</span></div>
      </section>

      <section className="faq section shell" id="faq">
        <div className="section-heading"><div><p className="eyebrow copper">Коротко о важном</p><h2>Частые вопросы</h2></div><p>Если не нашли ответ — напишите нам, инженер ответит в течение рабочего дня.</p></div>
        <div className="faq-list">
          {faqs.map(([question, answer], index) => <article className={activeFaq === index ? "faq-item open" : "faq-item"} key={question}><button onClick={() => setActiveFaq(activeFaq === index ? null : index)}><span>{question}</span><b>{activeFaq === index ? "−" : "+"}</b></button>{activeFaq === index && <p>{answer}</p>}</article>)}
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="shell contact-wrap">
          <div><p className="eyebrow">Начнём с расчёта</p><h2>Получите смету<br />на вашу баню</h2><p>Инженер уточнит параметры участка, предложит конструкцию и подготовит расчёт в течение одного рабочего дня.</p><div className="contact-points"><span>✓ Без навязчивых звонков</span><span>✓ С разбивкой по материалам</span><span>✓ Цена фиксируется в договоре</span></div></div>
          <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setDemoNotice(true); }}>
            <span className="demo-chip dark">Интерактивный прототип</span><label>Как к вам обращаться?<input placeholder="Ваше имя" /></label><label>Телефон или Telegram<input placeholder="+7 999 000-00-00 или @username" /></label><label>Что планируете строить?<select defaultValue="Баня"><option>Баня</option><option>Гостевой дом</option><option>Баня + гостевой дом</option></select></label><button className="button primary" type="button" onClick={() => setDemoNotice(true)}>Показать сценарий заявки</button><small>Это портфолио-концепт: введённые данные не сохраняются и не отправляются</small>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-top"><div className="brand"><span className="brand-mark">С</span><span><b>СЕВЕРНАЯ</b><small>ПАРНАЯ</small></span></div><div><small>Тип работы</small><span>Портфолио-концепт</span></div><div><small>Контакты</small><span>Демонстрационные</span></div><div><small>География сценария</small><span>СПб и Ленинградская область</span></div></div>
        <div className="shell footer-bottom"><span>© 2026 Концепт «Северная Парная»</span><span>Бренд, кейсы, отзывы, цены и показатели созданы для демонстрации</span><button onClick={() => scrollTo("top")}>Наверх ↑</button></div>
      </footer>

      <div className="quick-contacts"><button className="telegram" onClick={() => setDemoNotice(true)} aria-label="Демонстрация Telegram-кнопки">✈</button><button className="phone" onClick={() => setDemoNotice(true)} aria-label="Демонстрация кнопки звонка">☎</button></div>

      {galleryIndex !== null && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="Галерея объекта" onClick={closeGallery}>
          <div className="gallery-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={closeGallery} aria-label="Закрыть галерею">×</button>
            <div
              className="gallery-stage"
              onPointerDown={(event) => {
                galleryTouchStart.current = event.clientX;
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerUp={(event) => finishGallerySwipe(event.clientX)}
              onPointerCancel={() => { galleryTouchStart.current = null; }}
            >
              <img src={gallery[galleryIndex]} alt={`Фотография объекта ${galleryIndex + 1} из ${gallery.length}`} draggable={false} />
            </div>
            <div className="gallery-controls">
              <button type="button" onClick={showPreviousPhoto} aria-label="Предыдущая фотография">←</button>
              <span aria-live="polite">{galleryIndex + 1} / {gallery.length}</span>
              <button type="button" onClick={showNextPhoto} aria-label="Следующая фотография">→</button>
              <button className="gallery-done" type="button" onClick={closeGallery}>Закрыть</button>
            </div>
            <div className="gallery-thumbs" aria-label="Все фотографии объекта">
              {gallery.map((src, index) => (
                <button
                  className={galleryIndex === index ? "active" : ""}
                  type="button"
                  key={`${src}-${index}`}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Открыть фотографию ${index + 1}`}
                  aria-current={galleryIndex === index ? "true" : undefined}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {demoNotice && <div className="demo-toast" role="status"><button onClick={() => setDemoNotice(false)} aria-label="Закрыть уведомление">×</button><b>Демонстрационный сценарий</b><p>Это портфолио-концепт. В реальном проекте действие отправило бы заявку в Telegram, почту или CRM. Здесь данные не сохраняются.</p></div>}
    </main>
  );
}
