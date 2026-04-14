import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <section className="flex flex-col gap-6 lg:gap-7 items-center justify-center flex-grow px-5 py-16 lg:py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm">
        <div className="relative">
          <img 
            src={heroImg} 
            className="w-[170px] h-[179px] relative z-0 mx-auto" 
            width="170" 
            height="179" 
            alt="" 
          />
          <img 
            src={reactLogo} 
            className="absolute inset-x-0 top-[34px] h-7 mx-auto z-10 transform-gpu" 
            style={{
              transform: 'perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4)'
            }}
            alt="React logo" 
          />
          <img 
            src={viteLogo} 
            className="absolute inset-x-0 top-[107px] h-[26px] w-auto mx-auto z-0 transform-gpu" 
            style={{
              transform: 'perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8)'
            }}
            alt="Vite logo" 
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Get started</h1>
          <p className="text-gray-700 text-lg max-w-md mx-auto leading-relaxed">
            Build amazing applications with React, Vite, and Tailwind CSS
          </p>
        </div>
        <button
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="relative w-full">
        <div className="absolute -top-1.5 left-0 w-0 h-0 border-[5px] border-transparent border-l-[var(--border)]"></div>
        <div className="absolute -top-1.5 right-0 w-0 h-0 border-[5px] border-transparent border-r-[var(--border)]"></div>
      </div>

      <section className="flex flex-col lg:flex-row bg-white/80 backdrop-blur-sm border-t border-gray-200 text-left shadow-lg">
        <div className="flex-1 p-8 lg:p-12 border-r border-gray-200 lg:border-r lg:border-b-0 border-b lg:text-left text-center bg-gradient-to-br from-blue-50/50 to-transparent">
          <svg className="w-[22px] h-[22px] mb-4 mx-auto lg:mx-0" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Documentation</h2>
          <p className="text-gray-600 mb-8 text-lg">Your questions, answered</p>
          <ul className="list-none p-0 flex gap-2 flex-wrap justify-center lg:justify-start">
            <li className="flex-1 lg:flex-none min-w-0">
              <a 
                href="https://vite.dev/" 
                target="_blank"
                className="text-gray-700 text-base rounded-lg bg-white border border-gray-200 flex p-3 lg:p-4 items-center gap-3 no-underline transition-all duration-300 hover:shadow-xl hover:bg-blue-50 hover:border-blue-300 justify-center w-full group"
              >
                <img className="h-[18px]" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li className="flex-1 lg:flex-none min-w-0">
              <a 
                href="https://react.dev/" 
                target="_blank"
                className="text-gray-700 text-base rounded-lg bg-white border border-gray-200 flex p-3 lg:p-4 items-center gap-3 no-underline transition-all duration-300 hover:shadow-xl hover:bg-blue-50 hover:border-blue-300 justify-center w-full group"
              >
                <img className="w-[18px] h-[18px]" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div className="flex-1 p-8 lg:p-12 text-center lg:text-left bg-gradient-to-br from-purple-50/50 to-transparent">
          <svg className="w-[22px] h-[22px] mb-4 mx-auto lg:mx-0" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2 className="text-2xl font-bold mb-3 text-gray-800">Connect with us</h2>
          <p className="text-gray-600 mb-8 text-lg">Join the Vite community</p>
          <ul className="list-none p-0 flex gap-2 flex-wrap justify-center lg:justify-start">
            <li className="flex-1 lg:flex-none min-w-0 lg:min-w-[calc(50%-4px)]">
              <a 
                href="https://github.com/vitejs/vite" 
                target="_blank"
                className="text-gray-700 text-base rounded-md bg-gray-50 flex p-2 lg:p-3 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-lg justify-center w-full"
              >
                <svg
                  className="w-[18px] h-[18px]"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li className="flex-1 lg:flex-none min-w-0 lg:min-w-[calc(50%-4px)]">
              <a 
                href="https://chat.vite.dev/" 
                target="_blank"
                className="text-gray-700 text-base rounded-md bg-gray-50 flex p-2 lg:p-3 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-lg justify-center w-full"
              >
                <svg
                  className="w-[18px] h-[18px]"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li className="flex-1 lg:flex-none min-w-0 lg:min-w-[calc(50%-4px)]">
              <a 
                href="https://x.com/vite_js" 
                target="_blank"
                className="text-gray-700 text-base rounded-md bg-gray-50 flex p-2 lg:p-3 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-lg justify-center w-full"
              >
                <svg
                  className="w-[18px] h-[18px]"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li className="flex-1 lg:flex-none min-w-0 lg:min-w-[calc(50%-4px)]">
              <a 
                href="https://bsky.app/profile/vite.dev" 
                target="_blank"
                className="text-gray-700 text-base rounded-md bg-gray-50 flex p-2 lg:p-3 items-center gap-2 no-underline transition-shadow duration-300 hover:shadow-lg justify-center w-full"
              >
                <svg
                  className="w-[18px] h-[18px]"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="relative w-full">
        <div className="absolute -top-1.5 left-0 w-0 h-0 border-[5px] border-transparent border-l-gray-300"></div>
        <div className="absolute -top-1.5 right-0 w-0 h-0 border-[5px] border-transparent border-r-gray-300"></div>
      </div>
      <section className="h-22 lg:h-12 border-t border-gray-300"></section>
    </div>
  )
}

export default App