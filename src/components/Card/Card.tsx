import cn from 'classnames';
import Text from 'components/Text';
import React from 'react';

import styles from './card.module.scss';

export type CardProps = {
  /** Дополнительный classname */
  className?: string;
  /** URL изображения */
  image: string;
  /** Слот над заголовком */
  captionSlot?: React.ReactNode;
  /** Заголовок карточки */
  title: React.ReactNode;
  /** Описание карточки */
  subtitle: React.ReactNode;
  /** Содержимое карточки (футер/боковая часть), может быть пустым */
  contentSlot?: React.ReactNode;
  /** Клик на карточку */
  onClick?: React.MouseEventHandler;
  /** Слот для действия */
  actionSlot?: React.ReactNode;
};

const Card: React.FC<CardProps> = ({
  className,
  image,
  captionSlot,
  title,
  subtitle,
  contentSlot,
  onClick,
  actionSlot,
}) => {
  const cardClassName = cn(styles.card, className, { [styles.card_clickable]: onClick });
  return (
    <div className={cardClassName} onClick={onClick}>
      <div className={styles.card__header}>
        <img src={image} alt="" className={styles.card__image} />
      </div>
      <div className={styles.card__body}>
        <div className={styles['card__text-content']}>
          {captionSlot && (
            <Text className="card-caption" view="p-14" color="secondary" weight="medium">
              {captionSlot}
            </Text>
          )}
          <Text tag="h3" view="p-20" weight="medium" maxLines={2} className="card-title">
            {title}
          </Text>
          <Text
            tag="p"
            view="p-16"
            weight="normal"
            color="secondary"
            maxLines={3}
            className="card__subtitle"
          >
            {subtitle}
          </Text>
        </div>
        {contentSlot || actionSlot ? (
          <div className={styles['card__functional-content']}>
            {contentSlot && <div className="card-content-slot">{contentSlot}</div>}
            {actionSlot && <div className="card-content-action">{actionSlot}</div>}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Card;
