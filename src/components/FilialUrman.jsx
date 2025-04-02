import React, { memo, useState, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { HiOutlineArrowUturnDown } from 'react-icons/hi2';
import CategoriesUrman from './CategoriesUrman';
import CategoryCard from './CategoryCard';
import CategoryGroup from './CategoryGroup';

const FilialUrman = memo(({ data }) => {
  // Конфигурация групп и порядка отображения
  const groupConfig = useMemo(() => ({
    // Порядок и количество элементов для каждой группы
    order: ['popular', 'special', 'new', 'sale'],
    itemsCount: {
      popular: 8,
      special: 6,
      new: 4,
      sale: 6,
      default: 4 // Для групп не указанных в конфиге
    },
    // Группы для верхнего меню (первые 5 или указанные)
    menuGroups: ['popular', 'special', 'new', 'sale']
  }), []);

  const [activeGroup, setActiveGroup] = useState(null);
  const [showAll, setShowAll] = useState(false);

  // Фильтруем и сортируем группы согласно конфигурации
  const processedGroups = useMemo(() => {
    if (!data) return [];

    // Создаем мап данных для быстрого доступа
    const dataMap = data.reduce((acc, group) => {
      acc[group.id] = group;
      return acc;
    }, {});

    // Сортируем группы согласно порядку из конфига
    const orderedGroups = groupConfig.order
      .map(id => dataMap[id])
      .filter(Boolean);

    // Добавляем остальные группы, не указанные в конфиге
    const remainingGroups = data.filter(
      group => !groupConfig.order.includes(group.id)
    );

    return [...orderedGroups, ...remainingGroups];
  }, [data, groupConfig.order]);

  // Группы для верхнего меню
  const menuGroups = useMemo(() => {
    if (!data) return [];

    return groupConfig.menuGroups
      .map(id => data.find(group => group.id === id))
      .filter(Boolean)
      .slice(0, 5); // Максимум 5 групп в меню
  }, [data, groupConfig.menuGroups]);

  // Обработчик клика по группе в меню
  const handleGroupClick = (groupId) => {
    setActiveGroup(activeGroup === groupId ? null : groupId);
  };

  // Обработчик показать все/скрыть
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
    setActiveGroup(null);
  };

  return (
    <section className="sec-3 mb-5">
      {/* Верхнее меню (аналогичное CategoriesUrman) */}
      {menuGroups.length > 0 && (
        <CategoriesUrman
          data={menuGroups}
          className="filial-menu"
        />
      )}

      <Container>
        {/* Отображение групп */}
        <div className="categories-box">
          {processedGroups.map(group => {
            const isActive = activeGroup === group.id || showAll;
            const itemsCount = groupConfig.itemsCount[group.id] || groupConfig.itemsCount.default;
            const itemsToShow = isActive ? group.items : (group.items || []).slice(0, itemsCount);

            return (
              <CategoryGroup
                key={group.id}
                data={{
                  ...group,
                  items: itemsToShow
                }}
                showTitle={true}
                onTitleClick={() => handleGroupClick(group.id)}
                isExpanded={isActive}
                showMoreButton={!isActive && group?.items?.length > itemsCount}
              />
            );
          })}
        </div>

        {/* Кнопка показать все/скрыть */}
        {processedGroups.length > 1 && (
          <div className="text-center mt-4">
            <button
              draggable={false}
              type="button"
              onClick={toggleShowAll}
              className="main-color mx-auto"
            >
              <span>{showAll ? 'Скрыть все' : 'Показать все'}</span>
              <HiOutlineArrowUturnDown className={`fs-15 ms-3 main-color ${showAll ? '' : 'rotateY-180'}`} />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
});

export default FilialUrman;