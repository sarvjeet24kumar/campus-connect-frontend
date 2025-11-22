// import { useEffect, useState } from 'react';

// const Loader = ({ size = 'md', text = '' }) => {
//   const sizeClasses = {
//     sm: 'w-8 h-8',
//     md: 'w-12 h-12',
//     lg: 'w-16 h-16',
//   };

//   return (
//     <div className="flex flex-col items-center justify-center">
//       <div
//         className={`${sizeClasses[size]} border-4 border-white border-t-transparent rounded-full animate-spin`}
//       ></div>
//       {text && <p className="mt-4 text-white">{text}</p>}
//     </div>
//   );
// };

// const WelcomeScreen = ({ onComplete }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onComplete();
//     }, 2000);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [onComplete]);

//   return (
//     <div
//       className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100vw',
//         height: '100vh',
//         zIndex: 9999,
//       }}
//     >
//       <div className="text-center">
//         <div className="mb-8">
//           <h1 className="mb-2 text-5xl font-bold text-white">
//             Welcome to CampusConnect
//           </h1>
//         </div>
//         <Loader size="lg" text="" />
//       </div>
//     </div>
//   );
// };
// export default WelcomeScreen;
