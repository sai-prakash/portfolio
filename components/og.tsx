import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

export function ogImage(title: string, kicker: string) {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#EAEDF7', padding: 72, fontFamily: 'Georgia, serif' }}>
        <div style={{ display: 'flex', fontSize: 30, color: '#2E3BC4' }}>{kicker}</div>
        <div style={{ display: 'flex', fontSize: title.length > 60 ? 64 : 78, lineHeight: 1.05, color: '#12163A', fontWeight: 700, letterSpacing: -2 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 30, color: '#12163A' }}>
          <span>Sai Prakash</span>
          <span style={{ display: 'flex', background: '#F5B82E', padding: '8px 20px', borderRadius: 999 }}>saiprakash.design</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
