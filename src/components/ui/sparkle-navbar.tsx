"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Link, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export type SparkleNavChildItem = {
  label: string;
  href: string;
};

export type SparkleNavItem = {
  label: string;
  href?: string;
  children?: SparkleNavChildItem[];
};

export type SparkleNavbarProps = {
  items: SparkleNavItem[];
  activeIndex: number;
  color?: string;
  className?: string;
  isDark?: boolean;
};

const STRIKE_PATH =
  "M113.5 6.5L109.068 8.9621C109.023 8.98721 108.974 9.00516 108.923 9.01531L106.889 9.42219C106.661 9.46776 106.432 9.35034 106.336 9.1388L104.045 4.0986C104.015 4.03362 104 3.96307 104 3.8917V2.12268C104 1.6898 103.487 1.46145 103.166 1.75103L99.2887 5.24019C99.1188 5.39305 98.867 5.41132 98.6768 5.28457L95.0699 2.87996C94.7881 2.69205 94.4049 2.83291 94.3118 3.15862L92.6148 9.09827C92.5483 9.33084 92.3249 9.48249 92.0843 9.45843L87.7087 9.02087C87.5752 9.00752 87.4419 9.04839 87.3389 9.13428L84.9485 11.1263C84.7128 11.3227 84.3575 11.2625 84.1996 10.9994L81.7602 6.93359C81.617 6.69492 81.3064 6.61913 81.0694 6.76501L75.3165 10.3052C75.1286 10.4209 74.8871 10.3997 74.7223 10.2531L70.6678 6.64917C70.5611 6.55429 70.5 6.41829 70.5 6.27547V1.20711C70.5 1.0745 70.4473 0.947322 70.3536 0.853553L70.2185 0.718508C70.0846 0.584592 69.8865 0.537831 69.7068 0.59772L69.2675 0.744166C68.9149 0.861705 68.8092 1.30924 69.0721 1.57206L69.605 2.10499C69.8157 2.31571 69.7965 2.66281 69.5638 2.84897L67.5 4.5L65.2715 6.28282C65.1083 6.41338 64.8811 6.42866 64.7019 6.32113L60.3621 3.71725C60.153 3.59179 59.8839 3.63546 59.7252 3.8206L57.0401 6.95327C57.0135 6.9843 56.9908 7.01849 56.9725 7.05505L55.2533 10.4934C55.1188 10.7624 54.779 10.8526 54.5287 10.6858L50.7686 8.17907C50.6051 8.07006 50.3929 8.06694 50.2263 8.17109L46.7094 10.3691C46.5774 10.4516 46.4145 10.468 46.2688 10.4133L42.6586 9.05949C42.5558 9.02091 42.4684 8.94951 42.4102 8.85633L40.1248 5.1997C40.0458 5.07323 40.0273 4.91808 40.0745 4.77659L40.6374 3.08777C40.7755 2.67359 40.3536 2.29381 39.9562 2.47447L35.5 4.5L32.2657 5.88613C32.1013 5.95658 31.9118 5.93386 31.7687 5.82656L30.1904 4.64279C30.0699 4.55245 29.9152 4.5212 29.7691 4.55772L26.2009 5.44977C26.0723 5.48193 25.9617 5.56388 25.8934 5.67759L23.1949 10.1752C23.0796 10.3673 22.8507 10.4593 22.6346 10.4003L17.6887 9.05148C17.5674 9.01838 17.463 8.94076 17.3963 8.83409L15.3331 5.53299C15.1627 5.26032 14.7829 5.21707 14.5556 5.44443L12.1464 7.85355C12.0527 7.94732 11.9255 8 11.7929 8H8.15139C8.05268 8 7.95617 7.97078 7.87404 7.91603L3.74143 5.16095C3.59214 5.06142 3.40096 5.04952 3.24047 5.12976L0.5 6.5";

function createStrikeSvg() {
  return `<svg viewBox="0 0 114 12" preserveAspectRatio="none">
        <g fill="none" stroke="white" stroke-width="0.75" stroke-linecap="round">
          <path d="${STRIKE_PATH}" />
          <path d="${STRIKE_PATH}" />
          <path d="${STRIKE_PATH}" />
        </g>
      </svg>`;
}

function createSVG(element: HTMLDivElement, color: string) {
  element.innerHTML = `
    <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam">
      <path d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z" fill="url(#gradient-beam)"/>
      <defs>
        <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="${color}"/>
          <stop offset="1" stop-color="white"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="strike">
      ${createStrikeSvg()}
      ${createStrikeSvg()}
    </div>
    `;
}

export function SparkleNavbar({
  items,
  activeIndex,
  color = "#009cc2",
  className,
  isDark = false,
}: SparkleNavbarProps) {
  const router = useRouter();
  const resolvedIndex =
    activeIndex >= 0 && activeIndex < items.length ? activeIndex : 0;

  const navRef = useRef<HTMLDivElement>(null);
  const activeElementRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLElement | null)[]>([]);
  const isAnimatingRef = useRef(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

  const getOffsetLeft = (element: HTMLElement) => {
    if (!navRef.current || !activeElementRef.current) return 0;
    const elementRect = element.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    const activeElementWidth = activeElementRef.current.offsetWidth;
    return (
      elementRect.left -
      navRect.left +
      (elementRect.width - activeElementWidth) / 2
    );
  };

  const positionBeam = useCallback((index: number, show = true) => {
    const button = buttonRefs.current[index];
    if (!navRef.current || !activeElementRef.current || !button) return;
    gsap.set(activeElementRef.current, {
      x: getOffsetLeft(button),
      ...(show ? { "--active-element-show": "1" } : {}),
    });
  }, []);

  useLayoutEffect(() => {
    if (isAnimatingRef.current) return;
    positionBeam(resolvedIndex);
  }, [resolvedIndex, items.length, positionBeam]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (isAnimatingRef.current) return;
      positionBeam(resolvedIndex);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [resolvedIndex, positionBeam]);

  useEffect(() => {
    if (openDropdownIndex === null) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenDropdownIndex(null);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdownIndex]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string,
  ) => {
    const navElement = navRef.current;
    const activeElement = activeElementRef.current;
    const oldButton = buttonRefs.current[resolvedIndex];
    const newButton = buttonRefs.current[index];

    if (
      index === resolvedIndex ||
      !navElement ||
      !activeElement ||
      !oldButton ||
      !newButton
    ) {
      return;
    }

    event.preventDefault();
    isAnimatingRef.current = true;

    const x = getOffsetLeft(newButton);
    const direction = index > resolvedIndex ? "after" : "before";
    const spacing = Math.abs(x - getOffsetLeft(oldButton));

    navElement.classList.add(direction);

    gsap.set(activeElement, {
      rotateY: direction === "before" ? "180deg" : "0deg",
    });

    gsap.to(activeElement, {
      keyframes: [
        {
          "--active-element-width": `${spacing > navElement.offsetWidth - 60 ? navElement.offsetWidth - 60 : spacing}px`,
          duration: 0.3,
          ease: "none",
          onStart: () => {
            createSVG(activeElement, color);
            gsap.to(activeElement, {
              "--active-element-opacity": 1,
              duration: 0.1,
            });
          },
        },
        {
          "--active-element-scale-x": "0",
          "--active-element-scale-y": ".25",
          "--active-element-width": "0px",
          duration: 0.3,
          onStart: () => {
            gsap.to(activeElement, {
              "--active-element-mask-position": "40%",
              duration: 0.5,
            });
            gsap.to(activeElement, {
              "--active-element-opacity": 0,
              delay: 0.45,
              duration: 0.25,
            });
          },
          onComplete: () => {
            activeElement.innerHTML = "";
            navElement.classList.remove("before", "after");
            gsap.set(activeElement, {
              x: getOffsetLeft(newButton),
              "--active-element-show": "1",
            });
            isAnimatingRef.current = false;
            router.push(href);
          },
        },
      ],
    });

    gsap.to(activeElement, {
      x,
      "--active-element-strike-x": "-50%",
      duration: 0.6,
      ease: "none",
    });
  };

  return (
    <div className={cn("sparkle-navbar", className)}>
      <style>{`
        .sparkle-navbar .navigation-menu {
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .sparkle-navbar .navigation-menu ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: flex;
          gap: 40px;
        }

        .sparkle-navbar .navigation-menu ul li {
          position: relative;
        }

        .sparkle-navbar .navigation-menu ul li a {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border: none;
          cursor: pointer;
          background-color: transparent;
          padding: 0;
          margin: 0;
          line-height: 22px;
          transition: color 0.25s;
          text-decoration: none;
          display: inline-block;
        }

        .sparkle-navbar .navigation-menu ul li:not(.active):hover a {
          text-shadow: 0 0 10px ${color}, 0 0 20px ${color};
        }

        .sparkle-navbar .navigation-menu .active-element {
          --active-element-scale-x: 1;
          --active-element-scale-y: 1;
          --active-element-show: 0;
          --active-element-opacity: 0;
          --active-element-width: 0px;
          --active-element-strike-x: 0%;
          --active-element-mask-position: 0%;
          position: absolute;
          left: 0;
          top: 34px;
          height: 3px;
          width: 36px;
          border-radius: 2px;
          background-color: ${color};
          opacity: var(--active-element-show);
        }

        .sparkle-navbar .navigation-menu .active-element > svg,
        .sparkle-navbar .navigation-menu .active-element .strike {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          opacity: var(--active-element-opacity);
          width: var(--active-element-width);
          mix-blend-mode: multiply;
        }

        .sparkle-navbar .navigation-menu .active-element > svg {
          display: block;
          overflow: visible;
          height: 5px;
          filter: blur(0.5px) drop-shadow(2px 0px 8px ${color}40) drop-shadow(1px 0px 2px ${color}80) drop-shadow(0px 0px 3px ${color}40) drop-shadow(2px 0px 8px ${color}45) drop-shadow(8px 0px 16px ${color}50);
        }

        .sparkle-navbar .navigation-menu .active-element .strike {
          padding: 24px 0;
          -webkit-mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
          mask-image: linear-gradient(to right, transparent calc(0% + var(--active-element-mask-position)), black calc(15% + var(--active-element-mask-position)), black 80%, transparent);
        }

        .sparkle-navbar .navigation-menu .active-element .strike svg {
          display: block;
          overflow: visible;
          height: 12px;
          width: calc(var(--active-element-width) * 2);
          transform: translate(var(--active-element-strike-x), 30%) scale(var(--active-element-scale-x), var(--active-element-scale-y));
        }

        .sparkle-navbar .navigation-menu .active-element .strike svg:last-child {
          transform: translate(var(--active-element-strike-x), -30%) scale(-1);
        }

        .sparkle-navbar .navigation-menu .active-element .strike svg g path:nth-child(2) {
          filter: blur(2px);
        }

        .sparkle-navbar .navigation-menu .active-element .strike svg g path:nth-child(3) {
          filter: blur(4px);
        }

        .sparkle-navbar .navigation-menu.before .active-element {
          transform: rotateY(180deg);
        }
      `}</style>

      <nav className="navigation-menu" ref={navRef} aria-label="Main">
        <ul>
          {items.map((item, index) => {
            const isActive = index === resolvedIndex;
            const isDropdown = Boolean(item.children?.length);
            const isOpen = openDropdownIndex === index;
            const triggerClassName = cn(
              "inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight transition-colors",
              !isActive &&
              (isDark
                ? "text-secondary hover:text-primary"
                : "text-slate-500 hover:text-primary"),
              isOpen && !isActive && "text-primary",
            );

            return (
              <li
                key={item.href ?? item.label}
                className={isActive ? "active" : ""}
                onMouseEnter={() => {
                  if (isDropdown) setOpenDropdownIndex(index);
                }}
                onMouseLeave={() => {
                  if (isDropdown) setOpenDropdownIndex(null);
                }}
              >
                {isDropdown ? (
                  <>
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-haspopup="menu"
                      className={cn(
                        "m-0 inline-flex appearance-none border-0 bg-transparent p-0",
                        triggerClassName,
                      )}
                      style={isActive ? { color } : undefined}
                      onClick={() => setOpenDropdownIndex(index)}
                    >
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "material-symbols-outlined text-base transition-transform",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden
                      >
                        keyboard_arrow_down
                      </span>
                    </button>

                    <div
                      role="menu"
                      aria-label={item.label}
                      className={cn(
                        "absolute left-1/2 top-full z-30 min-w-[12rem] -translate-x-1/2 pt-2 transition-all duration-200",
                        isOpen
                          ? "pointer-events-auto visible translate-y-0 opacity-100"
                          : "pointer-events-none invisible -translate-y-2 opacity-0",
                      )}
                    >
                      <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rotate-45 border-s border-t border-white/30 bg-[#4ea3cb]" />
                      <div className="relative flex flex-col gap-1 rounded-[1.25rem] border border-white/30 bg-[#4ea3cb] p-3 text-white shadow-2xl shadow-[#009cc2]/20 backdrop-blur-md">
                        {item.children?.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            role="menuitem"
                            className="rounded-2xl px-4 py-3 text-center text-base font-semibold transition-colors hover:bg-white/12 focus-visible:bg-white/12"
                            onClick={() => setOpenDropdownIndex(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : item.href ? (
                  <Link
                    ref={(el) => {
                      buttonRefs.current[index] = el;
                    }}
                    href={item.href}
                    onClick={(e) => handleClick(e, index, item.href!)}
                    className={triggerClassName}
                    style={isActive ? { color } : undefined}
                  >
                    {item.label}
                  </Link>
                ) : null}
              </li>
            );
          })}
        </ul>
        <div className="active-element" ref={activeElementRef} />
      </nav>
    </div>
  );
}
