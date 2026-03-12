'use client';

import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import GjsEditor from '@grapesjs/react';
import type { Editor } from 'grapesjs';

interface VisualBuilderEditorProps {
  onReady?: (editor: Editor) => void;
  primaryColor?: string;
  onSave?: (html: string, css: string) => void;
}

export default function VisualBuilderEditor({ onReady, primaryColor = '#163A63', onSave }: VisualBuilderEditorProps) {
  const handleReady = (editor: Editor) => {
    const bm = editor.BlockManager;
    // Clear all default blocks
    bm.getAll().reset();

    const btn = (label: string) =>
      `<a href="#" style="display:inline-block;padding:14px 32px;background:${primaryColor};color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;">${label}</a>`;

    // ── SECTIONS ──────────────────────────────────────────────────────────────

    bm.add('hero-centered', {
      label: '🌟 Hero – Centered',
      category: 'Sections',
      content: `
        <section style="padding:100px 24px;text-align:center;background:linear-gradient(135deg,${primaryColor} 0%,#0F2847 100%);color:#fff;">
          <p style="font-size:14px;letter-spacing:3px;text-transform:uppercase;opacity:0.7;margin:0 0 16px;">Welcome</p>
          <h1 style="font-size:clamp(36px,6vw,72px);font-weight:800;margin:0 0 20px;line-height:1.1;">Grow Your Business Online</h1>
          <p style="font-size:18px;max-width:600px;margin:0 auto 40px;opacity:0.85;line-height:1.6;">Reach more customers and increase sales with a professional online presence built in minutes.</p>
          <div>${btn('Get Started Free')}&nbsp;&nbsp;<a href="#" style="display:inline-block;padding:14px 32px;background:transparent;color:#fff;border-radius:8px;font-weight:700;text-decoration:none;font-size:16px;border:2px solid rgba(255,255,255,0.5);">Learn More</a></div>
        </section>`,
    });

    bm.add('hero-split', {
      label: '✂️ Hero – Split',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#f8fafc;">
          <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
            <div>
              <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${primaryColor};font-weight:700;margin:0 0 16px;">Solutions for your business</p>
              <h1 style="font-size:clamp(32px,4vw,56px);font-weight:800;color:#0f172a;margin:0 0 20px;line-height:1.15;">Everything You Need to Succeed</h1>
              <p style="font-size:17px;color:#475569;margin:0 0 36px;line-height:1.7;">We provide the tools and support to help your business thrive in today's competitive market.</p>
              ${btn('Start Free Trial')}
            </div>
            <div style="background:${primaryColor};border-radius:16px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;">
              <p style="color:rgba(255,255,255,0.5);font-size:14px;">📸 Your image here</p>
            </div>
          </div>
        </section>`,
    });

    bm.add('features-3col', {
      label: '⚡ Features – 3 Column',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;text-align:center;">
            <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#0f172a;margin:0 0 12px;">Why Choose Us</h2>
            <p style="font-size:17px;color:#64748b;margin:0 auto 60px;max-width:560px;">Everything your business needs to grow and succeed online.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:32px;">
              ${['🚀 Fast & Reliable', '🔒 Secure & Trusted', '📈 Results Driven'].map((title, i) => `
                <div style="padding:36px 28px;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;">
                  <div style="font-size:40px;margin-bottom:16px;">${title.split(' ')[0]}</div>
                  <h3 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 12px;">${title.slice(3)}</h3>
                  <p style="color:#64748b;line-height:1.7;margin:0;">We deliver exceptional results that help your business stand out and attract more customers.</p>
                </div>`).join('')}
            </div>
          </div>
        </section>`,
    });

    bm.add('about', {
      label: '🏢 About Us',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#f8fafc;">
          <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;">
            <div style="background:${primaryColor};border-radius:16px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;">
              <p style="color:rgba(255,255,255,0.5);font-size:14px;">📸 Your image here</p>
            </div>
            <div>
              <p style="font-size:13px;letter-spacing:3px;text-transform:uppercase;color:${primaryColor};font-weight:700;margin:0 0 16px;">Our Story</p>
              <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#0f172a;margin:0 0 20px;">Built With Purpose, Driven by Results</h2>
              <p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 16px;">We started with a simple goal: to help businesses like yours succeed online without the complexity or high costs.</p>
              <p style="font-size:16px;color:#475569;line-height:1.8;margin:0 0 32px;">Our team of experts works tirelessly to deliver solutions that actually move the needle for your business.</p>
              ${btn('Learn More')}
            </div>
          </div>
        </section>`,
    });

    bm.add('testimonials', {
      label: '⭐ Testimonials',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;text-align:center;">
            <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#0f172a;margin:0 0 12px;">What Our Customers Say</h2>
            <p style="font-size:17px;color:#64748b;margin:0 auto 60px;max-width:560px;">Real results from real businesses just like yours.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;">
              ${[
                ['Sarah M.', 'Restaurant Owner', 'Doubled our bookings in 3 months!'],
                ['James K.', 'Retail Store', 'Best investment we ever made for marketing.'],
                ['Linda P.', 'Service Business', 'Professional, fast and actually works!'],
              ].map(([name, role, quote]) => `
                <div style="padding:32px;background:#f8fafc;border-radius:16px;border:1px solid #e2e8f0;text-align:left;">
                  <p style="color:#fbbf24;font-size:20px;margin:0 0 16px;">★★★★★</p>
                  <p style="font-size:16px;color:#334155;line-height:1.7;margin:0 0 24px;font-style:italic;">"${quote}"</p>
                  <div>
                    <p style="font-weight:700;color:#0f172a;margin:0;">${name}</p>
                    <p style="font-size:14px;color:#64748b;margin:4px 0 0;">${role}</p>
                  </div>
                </div>`).join('')}
            </div>
          </div>
        </section>`,
    });

    bm.add('pricing', {
      label: '💰 Pricing',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#f8fafc;">
          <div style="max-width:900px;margin:0 auto;text-align:center;">
            <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#0f172a;margin:0 0 12px;">Simple, Transparent Pricing</h2>
            <p style="font-size:17px;color:#64748b;margin:0 auto 60px;max-width:480px;">Choose the plan that fits your business. No hidden fees.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
              ${[
                ['Starter', '$29', '/mo', ['5 Products', '100 Leads/mo', 'Email Support'], false],
                ['Business', '$79', '/mo', ['Unlimited Products', '1000 Leads/mo', 'Priority Support', 'Analytics'], true],
                ['Enterprise', '$199', '/mo', ['Everything', 'Unlimited', 'Dedicated Manager'], false],
              ].map(([name, price, period, features, featured]) => `
                <div style="padding:36px 28px;background:${featured ? primaryColor : '#fff'};border-radius:16px;border:${featured ? 'none' : '1px solid #e2e8f0'};${featured ? 'transform:scale(1.04)' : ''}">
                  <p style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:${featured ? 'rgba(255,255,255,0.7)' : '#64748b'};margin:0 0 12px;">${name}</p>
                  <p style="font-size:48px;font-weight:800;color:${featured ? '#fff' : '#0f172a'};margin:0;line-height:1;">${price}<span style="font-size:18px;font-weight:500;">${period}</span></p>
                  <ul style="list-style:none;padding:0;margin:24px 0 32px;text-align:left;">
                    ${(features as string[]).map(f => `<li style="padding:6px 0;color:${featured ? 'rgba(255,255,255,0.85)' : '#475569'};font-size:15px;">✓ ${f}</li>`).join('')}
                  </ul>
                  <a href="#" style="display:block;padding:12px;background:${featured ? '#fff' : primaryColor};color:${featured ? primaryColor : '#fff'};border-radius:8px;font-weight:700;text-decoration:none;font-size:15px;">Get Started</a>
                </div>`).join('')}
            </div>
          </div>
        </section>`,
    });

    bm.add('cta-banner', {
      label: '📣 CTA Banner',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:${primaryColor};text-align:center;">
          <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#fff;margin:0 0 16px;">Ready to Grow Your Business?</h2>
          <p style="font-size:18px;color:rgba(255,255,255,0.8);margin:0 auto 40px;max-width:560px;">Join hundreds of businesses already growing with us. Start your free trial today. No credit card required.</p>
          <a href="#" style="display:inline-block;padding:16px 40px;background:#fff;color:${primaryColor};border-radius:8px;font-weight:800;text-decoration:none;font-size:17px;">Start Free Today →</a>
        </section>`,
    });

    bm.add('contact-form', {
      label: '📬 Contact Form',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#f8fafc;" id="contact">
          <div style="max-width:640px;margin:0 auto;text-align:center;">
            <h2 style="font-size:clamp(28px,4vw,40px);font-weight:800;color:#0f172a;margin:0 0 12px;">Get In Touch</h2>
            <p style="font-size:17px;color:#64748b;margin:0 auto 40px;">Leave your details and we'll get back to you within 24 hours.</p>
            <form style="text-align:left;background:#fff;padding:40px;border-radius:16px;border:1px solid #e2e8f0;">
              <div style="margin-bottom:20px;">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Full Name</label>
                <input type="text" placeholder="Your name" style="width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;box-sizing:border-box;" />
              </div>
              <div style="margin-bottom:20px;">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Email Address</label>
                <input type="email" placeholder="your@email.com" style="width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;box-sizing:border-box;" />
              </div>
              <div style="margin-bottom:20px;">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Phone (optional)</label>
                <input type="tel" placeholder="+1 (876) 000-0000" style="width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;box-sizing:border-box;" />
              </div>
              <div style="margin-bottom:28px;">
                <label style="display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px;">Message</label>
                <textarea placeholder="How can we help you?" style="width:100%;padding:12px 16px;border:1px solid #d1d5db;border-radius:8px;font-size:15px;box-sizing:border-box;height:120px;resize:vertical;"></textarea>
              </div>
              <button type="submit" style="width:100%;padding:14px;background:${primaryColor};color:#fff;border:none;border-radius:8px;font-size:16px;font-weight:700;cursor:pointer;">Send Message →</button>
            </form>
          </div>
        </section>`,
    });

    bm.add('stats-bar', {
      label: '📊 Stats Bar',
      category: 'Sections',
      content: `
        <section style="padding:60px 24px;background:${primaryColor};">
          <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center;">
            ${[['500+', 'Happy Clients'], ['98%', 'Satisfaction Rate'], ['3x', 'Average Growth'], ['24/7', 'Support']].map(([num, label]) => `
              <div>
                <p style="font-size:clamp(36px,5vw,56px);font-weight:800;color:#fff;margin:0 0 8px;">${num}</p>
                <p style="font-size:15px;color:rgba(255,255,255,0.75);margin:0;">${label}</p>
              </div>`).join('')}
          </div>
        </section>`,
    });

    bm.add('gallery', {
      label: '🖼️ Gallery',
      category: 'Sections',
      content: `
        <section style="padding:80px 24px;background:#fff;">
          <div style="max-width:1100px;margin:0 auto;text-align:center;">
            <h2 style="font-size:clamp(28px,4vw,44px);font-weight:800;color:#0f172a;margin:0 0 12px;">Our Work</h2>
            <p style="font-size:17px;color:#64748b;margin:0 auto 48px;max-width:480px;">A showcase of what we've built for our clients.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;">
              ${Array(6).fill(0).map((_, i) => `
                <div style="aspect-ratio:4/3;background:${i % 2 === 0 ? primaryColor : '#e2e8f0'};border-radius:12px;display:flex;align-items:center;justify-content:center;">
                  <p style="color:${i % 2 === 0 ? 'rgba(255,255,255,0.4)' : '#94a3b8'};font-size:13px;">📸 Image ${i + 1}</p>
                </div>`).join('')}
            </div>
          </div>
        </section>`,
    });

    bm.add('footer', {
      label: '🦶 Footer',
      category: 'Sections',
      content: `
        <footer style="padding:60px 24px 32px;background:#0f172a;color:#fff;">
          <div style="max-width:1100px;margin:0 auto;">
            <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px;">
              <div>
                <h3 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 16px;">Your Business</h3>
                <p style="color:#94a3b8;line-height:1.7;margin:0 0 20px;">Helping businesses grow online with professional digital solutions.</p>
                <p style="color:#64748b;font-size:14px;margin:0;">📧 hello@yourbusiness.com<br/>📱 +1 (876) 000-0000</p>
              </div>
              ${[['Company', ['About', 'Services', 'Pricing', 'Contact']], ['Support', ['FAQ', 'Help Center', 'Privacy Policy', 'Terms']], ['Follow Us', ['Facebook', 'Instagram', 'WhatsApp', 'LinkedIn']]].map(([title, links]) => `
                <div>
                  <h4 style="font-size:15px;font-weight:700;color:#fff;margin:0 0 20px;">${title}</h4>
                  <ul style="list-style:none;padding:0;margin:0;">
                    ${(links as string[]).map(l => `<li style="margin-bottom:10px;"><a href="#" style="color:#94a3b8;text-decoration:none;font-size:14px;">${l}</a></li>`).join('')}
                  </ul>
                </div>`).join('')}
            </div>
            <div style="border-top:1px solid #1e293b;padding-top:24px;text-align:center;">
              <p style="color:#475569;font-size:14px;margin:0;">© ${new Date().getFullYear()} Your Business. All rights reserved.</p>
            </div>
          </div>
        </footer>`,
    });

    // ── ELEMENTS ──────────────────────────────────────────────────────────────

    bm.add('button', {
      label: '🔘 Button',
      category: 'Elements',
      content: `<div style="padding:16px 0;text-align:center;">${btn('Click Here')}</div>`,
    });

    bm.add('divider', {
      label: '➖ Divider',
      category: 'Elements',
      content: `<div style="padding:24px 0;"><hr style="border:none;border-top:1px solid #e2e8f0;" /></div>`,
    });

    bm.add('text-block', {
      label: '📝 Text Block',
      category: 'Elements',
      content: `<div style="padding:32px 24px;max-width:760px;margin:0 auto;"><h2 style="font-size:32px;font-weight:800;color:#0f172a;margin:0 0 16px;">Your Heading Here</h2><p style="font-size:17px;color:#475569;line-height:1.8;margin:0;">Replace this with your own content. Click to edit any text, change colors, and make it your own.</p></div>`,
    });

    // ── LAYOUT ────────────────────────────────────────────────────────────────

    bm.add('two-col', {
      label: '◫ Two Columns',
      category: 'Layout',
      content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;padding:32px 24px;"><div style="padding:24px;background:#f8fafc;border-radius:12px;border:2px dashed #e2e8f0;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px;">Column 1 - drop content here</div><div style="padding:24px;background:#f8fafc;border-radius:12px;border:2px dashed #e2e8f0;min-height:120px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px;">Column 2 - drop content here</div></div>`,
    });

    bm.add('three-col', {
      label: '⊞ Three Columns',
      category: 'Layout',
      content: `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;padding:32px 24px;">${Array(3).fill(0).map((_, i) => `<div style="padding:20px;background:#f8fafc;border-radius:12px;border:2px dashed #e2e8f0;min-height:100px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-size:14px;">Column ${i + 1}</div>`).join('')}</div>`,
    });

    // Toolbar "Save" button
    const pn = editor.Panels;
    pn.addButton('options', {
      id: 'save-site',
      className: 'gjs-pn-btn',
      label: `<span style="font-size:13px;font-weight:700;padding:4px 12px;background:#2F8F5B;color:#fff;border-radius:6px;">💾 Publish</span>`,
      command: () => {
        const html = editor.getHtml();
        const css = editor.getCss() || '';
        onSave?.(html, css);
      },
      attributes: { title: 'Publish site' },
    });

    onReady?.(editor);
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white" style={{ minHeight: 580 }}>
      <GjsEditor
        grapesjs={grapesjs}
        options={{
          height: 'calc(100vh - 280px)',
          storageManager: false,
          deviceManager: {
            devices: [
              { name: 'Desktop', width: '' },
              { name: 'Tablet', width: '768px', widthMedia: '992px' },
              { name: 'Mobile', width: '375px', widthMedia: '480px' },
            ],
          },
          styleManager: {
            sectors: [
              {
                name: 'Typography',
                open: false,
                properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align'],
              },
              {
                name: 'Spacing',
                open: false,
                properties: ['margin', 'padding'],
              },
              {
                name: 'Background',
                open: false,
                properties: ['background-color', 'background-image'],
              },
              {
                name: 'Border',
                open: false,
                properties: ['border-radius', 'border', 'box-shadow'],
              },
            ],
          },
        }}
        onReady={handleReady}
      />
    </div>
  );
}
