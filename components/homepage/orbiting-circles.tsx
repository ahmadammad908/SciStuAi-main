import OrbitingCircles from "@/components/magicui/orbiting-circles";
import { IconProps } from "@radix-ui/react-icons/dist/types";

const Icons = {
  python: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#0277BD" d="M24.047,5c-1.555,0.005-2.633,0.142-3.936,0.367c-3.848,0.67-4.549,2.077-4.549,4.67V14h9v2H15.22h-4.35c-2.636,0-4.943,1.242-5.674,4.219c-0.826,3.417-0.863,5.557,0,9.125C5.851,32.005,7.294,34,9.931,34h3.632v-5.104c0-2.966,2.686-5.896,5.764-5.896h7.236c2.523,0,5-1.862,5-4.377v-8.586c0-2.439-1.759-4.263-4.218-4.672C27.406,5.359,25.589,4.994,24.047,5z M19.063,9c0.821,0,1.5,0.677,1.5,1.502c0,0.833-0.679,1.498-1.5,1.498c-0.837,0-1.5-0.664-1.5-1.498C17.563,9.68,18.226,9,19.063,9z" />
      <path fill="#FFC107" d="M23.078,43c1.555-0.005,2.633-0.142,3.936-0.367c3.848-0.67,4.549-2.077,4.549-4.67V34h-9v-2h9.343h4.35c2.636,0,4.943-1.242,5.674-4.219c0.826-3.417,0.863-5.557,0-9.125C41.274,15.995,39.831,14,37.194,14h-3.632v5.104c0,2.966-2.686,5.896-5.764,5.896h-7.236c-2.523,0-5,1.862-5,4.377v8.586c0,2.439,1.759,4.263,4.218,4.672C19.719,42.641,21.536,43.006,23.078,43z M28.063,39c-0.821,0-1.5-0.677-1.5-1.502c0-0.833,0.679-1.498,1.5-1.498c0.837,0,1.5,0.664,1.5,1.498C29.563,38.32,28.899,39,28.063,39z" />
    </svg>
  ),
  tensorflow: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#FF6F00" d="M24 7L24 24 37 32 37 15z" />
      <path fill="#FF6F00" d="M24 7L11 15 11 32 24 24z" />
      <path fill="#FF9800" d="M24 23.5L24 41 37 33 37 15.5z" />
      <path fill="#FF9800" d="M24 23.5L11 31.5 11 15.5 24 7.5z" />
      <path fill="#FB8C00" d="M11 31.5L24 41 24 23.5 11 15.5z" />
      <path fill="#FB8C00" d="M37 31.5L24 41 24 23.5 37 15.5z" />
    </svg>
  ),
  pytorch: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#EE4C2C" d="M39.5,16c0,1.4-1.1,2.5-2.5,2.5s-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5S39.5,14.6,39.5,16z" />
      <path fill="#EE4C2C" d="M24,4C12.3,4,3,13.3,3,25s9.3,21,21,21s21-9.3,21-21S35.7,4,24,4z M24,42c-9.4,0-17-7.6-17-17S14.6,8,24,8s17,7.6,17,17S33.4,42,24,42z" />
    </svg>
  ),
  scistuai: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#2196F3" d="M24,4C12.3,4,3,13.3,3,25s9.3,21,21,21s21-9.3,21-21S35.7,4,24,4z" />
      <path fill="#FFF" d="M21,30h-3v-12h3V30z M30,18h-6v12h3v-4.5l3,4.5h3.5l-3.7-5.5l3.2-4.5H30V18z" />
    </svg>
  ),
  education: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#FFB300" d="M24 4L44 16 24 28 4 16z" />
      <path fill="#FFB300" d="M44 16v16L24 44 4 32V16" />
      <path fill="#FF9800" d="M24 28v16l20-12V16L24 28z" />
      <path fill="#FF9800" d="M24 28v16L4 32V16l20 12z" />
    </svg>
  ),
  book: (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30px" height="30px" {...props}>
      <path fill="#2196F3" d="M24 4c-5.5 0-10 4.5-10 10v24c0 5.5 4.5 10 10 10s10-4.5 10-10V14c0-5.5-4.5-10-10-10z" />
      <path fill="#1976D2" d="M32 14H16c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V16c0-1.1-.9-2-2-2z" />
    </svg>
  )
};

export function OrbitingCirclesComponent() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        SciStuAI
      </span>

      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}
      >
        <Icons.python />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}
      >
        <Icons.tensorflow />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
      >
        <Icons.pytorch />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
        delay={20}
      >
        <Icons.scistuai />
      </OrbitingCircles>

      {/* Add new education icons to outer circle */}
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
        delay={40}
      >
        <Icons.education />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
        delay={60}
      >
        <Icons.book />
      </OrbitingCircles>
    </div>
  );
}
