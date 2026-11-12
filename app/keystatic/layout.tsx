import KeystaticApp from './keystatic';
export const metadata = { title: 'Edit content', robots: { index: false, follow: false } };
export default function Layout() {
  return (
    <html lang="en">
      <body>
        <KeystaticApp />
      </body>
    </html>
  );
}
