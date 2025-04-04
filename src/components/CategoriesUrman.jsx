import React, { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-scroll";
import { FreeMode, Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HiArrowUturnUp, HiOutlineArrowUturnDown } from "react-icons/hi2";
import { Container } from "react-bootstrap";

const CategoriesUrman = memo(({ className, data, filial = false, catalogKey, initialActiveId }) => {
  const [isFull, setIsFull] = useState(false);
  const swiperRef = useRef(null);
  const [isShowMenu, setIsShowMenu] = useState(false);
  const menuRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация активной категории
  useEffect(() => {
    if (initialActiveId) {
      const targetId = `category-${initialActiveId}`;
      setActiveCategory(targetId);

      // Прокрутка к нужной категории после инициализации
      const timer = setTimeout(() => {
        const index = data.findIndex(e => `category-${e.id}` === targetId);
        if (index >= 0 && swiperRef.current?.swiper) {
          swiperRef.current.swiper.slideTo(index);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [initialActiveId, data]);

  // Инициализация Swiper
  useEffect(() => {
    if (data?.length && !isInitialized) {
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  const handleExpand = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.disable();
      setIsFull(true);
    }
  };

  const handleCollapse = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.enable();
      setIsFull(false);
    }
  };

  const updateSlider = (i) => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slideTo(i);
      if (isFull) {
        setIsFull(false);
        swiperRef.current.swiper.enable();
      }
    }
  };

  const handleSetActive = (to) => {
    setActiveCategory(to);
    const index = data.findIndex(e => `category-${e.id}` === to);
    if (index >= 0) updateSlider(index);
  };

  // Определение активной категории при скролле
  useEffect(() => {
    const handleScroll = () => {
      if (!data?.length) return;

      const sections = data.map(item => {
        const el = document.getElementById(`category-${item.id}`);
        return {
          id: `category-${item.id}`,
          element: el,
          top: el ? el.getBoundingClientRect().top : 0
        };
      }).filter(s => s.element);

      const scrollPosition = window.scrollY + 150; // Учитываем offset

      // Находим текущую активную секцию
      let currentSection = null;
      for (let i = 0; i < sections.length; i++) {
        const sectionTop = sections[i].element.offsetTop;
        const sectionBottom = i < sections.length - 1
          ? sections[i + 1].element.offsetTop
          : document.body.scrollHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          currentSection = sections[i].id;
          break;
        }
      }

      if (currentSection && currentSection !== activeCategory) {
        setActiveCategory(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, activeCategory]);

  // Показ/скрытие меню при скролле
  useEffect(() => {
    const updateView = () => {
      const menuNode = menuRef.current;
      if (menuNode) {
        const rect = menuNode.getBoundingClientRect();
        const scrollTop = window.scrollY || window.pageYOffset;
        setIsShowMenu(scrollTop > rect.top + scrollTop - 60);
      }
    };

    window.addEventListener("scroll", updateView, { passive: true });
    updateView();
    return () => window.removeEventListener("scroll", updateView);
  }, []);

  if (!data?.length || !isInitialized) return null;

  return (
    <>
      <div ref={menuRef} />
      <div className={`sticky-box-urman container p-0 mt-5 pe-md-3 ps-md-3 mb-3 mb-sm-4 mb-md-5 ${isShowMenu ? "show" : ""}`}>
        <Container className="p-0" style={filial ? { width: 'fit-content', margin: '0 auto' } : {}}>
          <div className={`categories-urman${className ? ` ${className}` : ""} ${isShowMenu ? "scrolled" : ""}`}>
            <div className={isFull ? "p-0 categories-urman-wrap" : "categories-urman-wrap"}>
              {!filial && <div className="categories-urman-nav categories-urman-prev"></div>}
              <Swiper
                ref={swiperRef}
                key={`swiper-${catalogKey || data.length}`}
                loop={false}
                freeMode={{ enabled: true, sticky: true }}
                mousewheel={true}
                className={
                  isFull
                    ? "categories-urman-slider categories-urman-slider-disabled"
                    : `categories-urman-slider ${filial ? 'categories-urman-filial' : ''}`
                }
                modules={[Navigation, FreeMode, Mousewheel]}
                speed={750}
                spaceBetween={10}
                slidesPerView="auto"
                observer={true}
                observeSlideChildren={true}
                watchSlidesProgress={true}
                navigation={!filial ? {
                  nextEl: '.categories-urman-next',
                  prevEl: '.categories-urman-prev',
                } : false}
                breakpoints={{
                  576: { spaceBetween: 15 },
                  1200: { spaceBetween: 15 },
                }}
              >
                {data.map((e, index) => (
                  <SwiperSlide key={`${e.id}-${index}`}>
                    <Link
                      className={`categories-urman-item ${activeCategory === `category-${e.id}` ? 'active' : ''}`}
                      activeClass="active"
                      to={`category-${e.id}`}
                      spy={true}
                      smooth={true}
                      offset={-150}
                      duration={150}
                      onSetActive={() => handleSetActive(`category-${e.id}`)}
                      isDynamic={true}
                      ignoreCancelEvents={false}
                    >
                      {e.title}
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              {!filial && (
                <>
                  <div className="categories-urman-nav categories-urman-next"></div>
                  <button
                    draggable={false}
                    type="button"
                    onClick={isFull ? handleCollapse : handleExpand}
                    className="categories-urman-btn"
                  >
                    {isFull ? (
                      <HiArrowUturnUp className="fs-15 main-color" />
                    ) : (
                      <HiOutlineArrowUturnDown className="fs-15 main-color rotateY-180" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
});

export default CategoriesUrman;