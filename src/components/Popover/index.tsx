import { Popover } from '@mui/material';
import { MouseEvent, memo, useState } from 'react';
import styles from './PopoverGlobal.module.scss';
import { IPopover } from './type';

export default memo(function PopoverGlobal({
  title,
  children,
  extendedClass,
  extendedClassPop,
  style,
  marginLeft = 0,
  extendedClassSpan,
}: IPopover) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {(title || children) && (
        <div style={style} className={`${extendedClass}`}>
          <div
            aria-owns={open ? 'mouse-over-popover' : undefined}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            onClick={handlePopoverClose}
            className={`${styles.spanPopover} truncate`}
          >
            {children ? (
              <span>{children}</span>
            ) : (
              <span className="mr-1">{title!}</span>
            )}
          </div>

          <Popover
            id="mouse-over-popover"
            className="extend-popover"
            open={open}
            anchorEl={anchorEl}
            sx={{ pointerEvents: 'none', top: '-20px', marginLeft }}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'center', horizontal: 'left' }}
            disableScrollLock={true}
            disableRestoreFocus
            onClose={handlePopoverClose}
          >
            <div className={`${styles.popoverGlobal} ${extendedClassPop}`}>
              <span
                className={`${styles.spanPopover} ${extendedClassSpan} text-theme-blue font-medium text-[0.8rem]`}
              >
                {title!}
              </span>
            </div>
          </Popover>
        </div>
      )}
    </>
  );
});
