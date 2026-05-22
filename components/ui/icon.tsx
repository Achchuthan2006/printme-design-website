const iconPaths: Record<string, React.ReactNode> = {
  card: <path d="M5 8.75h14v6.5H5zM7.5 13h5M15.5 13h1" />,
  flyer: <path d="M7 5.5h10l3 3v10H7zM17 5.5v3h3M10 12h7M10 15h7" />,
  brochure: <path d="M6 6.5h5v11H6zM13 6.5h5v11h-5zM11 6.5h2v11h-2z" />,
  poster: <path d="M7 5.5h10v13H7zM9.5 10.5h5M9.5 13.5h4" />,
  banner: <path d="M6 8h12l-2 4 2 4H6l2-4zM4 8v10M20 8v10" />,
  sign: <path d="M8 5.5h8l3 4-3 4H8zM12 13.5v5" />,
  sticker: <path d="M8.5 6.5h7a2 2 0 0 1 2 2v7l-3-2.5-3 3-3-3-2 1.5v-6a2 2 0 0 1 2-2Z" />,
  passport: <path d="M6.5 7.5h11v9h-11zM12 10.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM9.5 14c.55-1.3 1.46-2 2.5-2s1.95.7 2.5 2" />,
  document: <path d="M8 5.5h7l3 3v10H8zM15 5.5v3h3M10 12h6M10 15h6" />,
  custom: <path d="M12 5.5l1.65 3.34 3.69.54-2.67 2.6.63 3.68L12 13.9l-3.3 1.76.63-3.68-2.67-2.6 3.69-.54Z" />,
  envelope: <path d="M5 7h14v10H5zM5 8l7 5 7-5" />,
  ruler: <path d="M5 16.5 16.5 5 19 7.5 7.5 19zM9 17l-2-2M11 15l-1-1M13 13l-2-2M15 11l-1-1" />,
  cheque: <path d="M5 7h14v10H5zM8 12h4M8 14.5h8M15.5 10.5h1" />,
  inspect: <path d="M10.5 6.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM14 14l3.5 3.5M9 10.5l1.1 1.1 2-2.2" />,
  spark: <path d="M12 5.5 13.4 10l4.1 2-4.1 2L12 18.5 10.6 14l-4.1-2 4.1-2z" />,
  arrow: <path d="M6 12h12M13 7l5 5-5 5" />,
  clock: <path d="M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM12 9v3.5l2.5 1.5" />,
  van: <path d="M4.5 9h9v5h-9zM13.5 10h2.8l1.7 2v2h-4.5zM7.5 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.5 16.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />,
  store: <path d="M5.5 9 7 6.5h10L18.5 9M6.5 9v8h11V9M9 13h6" />,
  check: <path d="m7.5 12 3 3 6-6" />,
};

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}
