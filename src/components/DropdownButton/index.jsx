import Link from 'next/link';
import React from 'react';
import style from './dropdown.module.css';

const DropdownButton = ({ hasMenu, text, href, list }) => {
  if (hasMenu) {
    return (
      <button className={style.dropdown}>
        <span>{text}</span>
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <div className={style['dropdown-content']}>
          {list.map((item) => (
            <Link key={item.text} href={item.url} passHref>
              <button className={style['dropdown-button']} tabIndex="-1">
                {item.text}
              </button>
            </Link>
          ))}
        </div>
      </button>
    );
  }

  /* <button className={style.dropdown}>
        <span>{text}</span>
        <svg
          className="w-5 h-5 ml-2 -mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
        <div className={style['dropdown-content']}>
          {list.map((item) => (
            <Link key={item.text} href={item.url} passHref>
              <a
                tabIndex="-1"
                className="text-gray-700 flex justify-between
                  w-full px-4 py-2 text-sm leading-5 text-left"
                role="menuitem"
              >
                {item.text}
              </a>
            </Link>
          ))}
        </div>
      </button> */

  return (
    <Link href={href} passHref>
      <button type="button" className={style.dropdown}>
        <span>{text}</span>
      </button>
    </Link>

    // <div className="relatve inline-block text-left dropdown">
    //   <style jsx>{`
    //     .dropdown:focus-within .dropdown-menu {
    //       opacity: 1;
    //       transform: translate(0) scale(1);
    //       visibility: visible;
    //     }
    //   `}</style>

    //   {hasMenu ? (
    //     <>
    //       <button
    //         className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out rounded-md hover:text-black focus:outline-none active:text-gray-800"
    //         type="button"
    //         aria-haspopup="true"
    //         aria-expanded="true"
    //         aria-controls="headlessui-menu-items-117"
    //       >
    //         <span>{text}</span>
    //         <svg
    //           className="w-5 h-5 ml-2 -mr-1"
    //           viewBox="0 0 20 20"
    //           fill="currentColor"
    //         >
    //           <path
    //             fillRule="evenodd"
    //             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
    //             clipRule="evenodd"
    //           ></path>
    //         </svg>
    //       </button>

    //       <div className="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
    //         <div
    //           className="absolute -translate-x-1/2 left-1/2 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 shadow-lg outline-none"
    //           aria-labelledby="headlessui-menu-button-1"
    //           id="headlessui-menu-items-117"
    //           role="menu"
    //         >
    //           <div className="py-1">
    //             {list.map((item) => (
    //               <Link key={item.text} href={item.url} passHref>
    //                 <a
    //                   tabIndex="-1"
    //                   className="text-gray-700 flex justify-between
    //               w-full px-4 py-2 text-sm leading-5 text-left"
    //                   role="menuitem"
    //                 >
    //                   {item.text}
    //                 </a>
    //               </Link>
    //             ))}
    //           </div>
    //         </div>
    //       </div>
    //     </>
    //   ) : (
    //     <Link href={href} passHref>
    //       <button
    //         className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-white transition duration-150 ease-in-out rounded-md hover:text-black focus:outline-none active:text-gray-800"
    //         type="button"
    //       >
    //         <span>{text}</span>
    //       </button>
    //     </Link>
    //   )}
    // </div>
  );
};

DropdownButton.defaultProps = {
  hasMenu: false,
};

export default DropdownButton;
