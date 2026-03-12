'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import {
  DndContext, DragEndEvent, useDraggable, useDroppable, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { supabase } from '@/lib/supabase';
import VisualBuilder from './VisualBuilder';
import {
  LayoutDashboard, LogOut, Loader2, Globe, Users, Megaphone, LifeBuoy,
  Settings, UserPlus, CreditCard, ExternalLink, Mail, Phone, Plus, Trash2, MessageCircle, X,
  Sparkles, ShoppingBag, Clock, PenTool, Layout, Send, Shield, ArrowRight, ImagePlus,
} from 'lucide-react';

const WEBSITE_TEMPLATES = {
  product: {
    emoji: '📦', label: 'Products & Wholesale', color: '#2F8F5B',
    hero_title: 'Quality Products, Wholesale Prices',
    hero_subtitle: 'Trusted B2B supplier with competitive pricing, reliable stock and fast delivery across the region.',
    value_line: 'Quality supply, every time.',
    process_title: 'Why businesses choose us',
    process_subtitle: 'We combine competitive pricing, consistent stock and fast delivery to make B2B purchasing effortless.',
    about_title: 'About our business',
    about_body1: 'We are a leading wholesale supplier delivering quality products to businesses of all sizes. Our streamlined supply chain and dedicated account management make procurement simple.',
    about_body2: 'From small retailers to large distributors. We have the stock, the prices, and the service you need to stay competitive.',
    stock_quote_title: 'Request a quote',
    stock_quote_subtitle: 'Tell us what you need. We reply within 24 hours with pricing and availability.',
  },
  service: {
    emoji: '🔧', label: 'Services & Trades', color: '#0891B2',
    hero_title: 'Expert Services That Deliver Results',
    hero_subtitle: 'Professional, reliable service with a focus on quality workmanship and your complete satisfaction.',
    value_line: 'Results you can count on.',
    process_title: 'Our services',
    process_subtitle: 'From initial consultation to project completion, we handle every detail with care and expertise.',
    about_title: 'About us',
    about_body1: 'We are a professional services business committed to delivering exceptional results. Our experienced team brings skill, dedication, and integrity to every job.',
    about_body2: 'We take pride in our reputation for quality work and customer satisfaction. Your project is our priority.',
    stock_quote_title: 'Get a free quote',
    stock_quote_subtitle: 'Describe what you need and we will get back to you with a detailed proposal.',
  },
  consulting: {
    emoji: '💼', label: 'Consulting & Coaching', color: '#7C3AED',
    hero_title: 'Strategic Advice That Drives Growth',
    hero_subtitle: 'Expert consulting to help you make smarter decisions, move faster and achieve measurable results.',
    value_line: 'Think bigger. Move faster.',
    process_title: 'Our approach',
    process_subtitle: 'Discovery, strategy, execution. We partner with you at every stage to turn challenges into opportunities.',
    about_title: 'About our firm',
    about_body1: 'We help business leaders make better decisions with confidence. Our consultants bring deep expertise across strategy, operations, marketing, and growth.',
    about_body2: 'We have helped companies across multiple industries unlock their potential and achieve sustainable growth.',
    stock_quote_title: 'Book a strategy call',
    stock_quote_subtitle: "Let's discuss your challenge. 30 minutes could change the direction of your business.",
  },
  tech: {
    emoji: '💻', label: 'Tech & Software', color: '#4F46E5',
    hero_title: 'Software That Scales With You',
    hero_subtitle: 'Streamline operations, automate workflows, and grow your business with tools built for modern teams.',
    value_line: 'Smarter tools. Better results.',
    process_title: 'What we build',
    process_subtitle: 'We design and develop software solutions that solve real problems and create measurable value for your business.',
    about_title: 'Who we are',
    about_body1: 'We are a software development studio specialising in building high-quality digital products. Our team combines technical expertise with business understanding to deliver solutions that work.',
    about_body2: 'From MVPs to enterprise platforms. We are with you from idea to launch and beyond.',
    stock_quote_title: 'Start a project',
    stock_quote_subtitle: "Tell us about your idea or challenge. We'll come back with a clear plan and honest quote.",
  },
  food: {
    emoji: '🍽️', label: 'Food & Beverage', color: '#D97706',
    hero_title: 'Fresh Quality, Every Order',
    hero_subtitle: 'Premium ingredients and reliable supply for food businesses that care about quality and consistency.',
    value_line: 'Fresh. Reliable. Delivered.',
    process_title: 'Why chefs love us',
    process_subtitle: 'Consistent quality, flexible ordering, and next-day delivery. Everything a food business needs to operate smoothly.',
    about_title: 'Our story',
    about_body1: 'We are passionate about food quality and understand the demands of running a food business. Our mission is to make sourcing premium ingredients as easy as possible.',
    about_body2: 'From independent restaurants to large catering operations. We deliver the quality and reliability you need.',
    stock_quote_title: 'Place a bulk order',
    stock_quote_subtitle: 'Tell us what you need and how often. We will set up a supply arrangement that works for you.',
  },
  agency: {
    emoji: '🚀', label: 'Agency & Creative', color: '#BE185D',
    hero_title: 'Creative Work That Gets Results',
    hero_subtitle: 'We build brands, campaigns, and digital experiences that capture attention and drive real business growth.',
    value_line: 'Bold ideas. Real results.',
    process_title: 'What we do',
    process_subtitle: 'Strategy, design, execution. We handle your marketing and brand so you can focus on running your business.',
    about_title: 'About the agency',
    about_body1: 'We are a full-service creative agency helping businesses stand out in crowded markets. Our team of strategists, designers, and marketers work together to deliver campaigns that perform.',
    about_body2: 'We believe great creative work should be measurable. Every project is backed by strategy and tracked for results.',
    stock_quote_title: 'Start a project',
    stock_quote_subtitle: 'Tell us about your brand and goals. We will come back with a tailored proposal.',
  },
  health: {
    emoji: '🏥', label: 'Health & Wellness', color: '#16A34A',
    hero_title: 'Your Health, Our Priority',
    hero_subtitle: 'Compassionate, professional health and wellness services designed around you and your wellbeing.',
    value_line: 'Feel better. Live better.',
    process_title: 'Our services',
    process_subtitle: 'We offer a comprehensive range of health and wellness services in a welcoming, professional environment.',
    about_title: 'About our practice',
    about_body1: 'We are a dedicated team of health professionals committed to delivering exceptional care. Our approach is holistic, evidence-based, and centred on your individual needs.',
    about_body2: 'Whether you are looking to improve your health, manage a condition, or reach your wellness goals. We are here to support you every step of the way.',
    stock_quote_title: 'Book an appointment',
    stock_quote_subtitle: 'Fill out the form and we will confirm your appointment within 24 hours.',
  },
  real_estate: {
    emoji: '🏠', label: 'Real Estate & Property', color: '#163A63',
    hero_title: 'Find Your Perfect Property',
    hero_subtitle: 'Expert real estate services with local knowledge, professional guidance, and a commitment to your success.',
    value_line: 'Your property goals, our expertise.',
    process_title: 'How we help',
    process_subtitle: 'From your first enquiry to the final signature. We guide you through every step of the property journey.',
    about_title: 'About our team',
    about_body1: 'We are experienced real estate professionals with deep local knowledge and a genuine commitment to helping our clients succeed. Whether buying, selling, or renting. We deliver results.',
    about_body2: 'Our reputation is built on honest advice, expert guidance, and exceptional service. Let us help you find the right property.',
    stock_quote_title: 'Get in touch',
    stock_quote_subtitle: "Tell us what you're looking for and we'll match you with the right property or buyer.",
  },
};

type Tab = 'home' | 'website' | 'crm' | 'marketing' | 'support' | 'team' | 'settings' | 'billing' | 'account';
type WebsiteSubTab = 'preview' | 'branding' | 'contact' | 'cms' | 'visual';
type CrmSubTab = 'pipeline' | 'contacts';
type CrmViewType = 'consulting' | 'deals' | 'product' | 'services';
const DEALS_STAGES = ['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
const CONSULTING_STAGES = ['DISCOVERY', 'STRATEGY_SESSION', 'PROPOSAL', 'CONTRACT_SIGNED'];

const INVITEABLE_ROLES = [
  { value: 'ADMIN' as const, label: 'Admin', desc: 'Team, settings, invite. No billing access' },
  { value: 'SALES_AGENT' as const, label: 'Sales Agent', desc: 'Leads, CRM, no billing access' },
  { value: 'FINANCE_MANAGER' as const, label: 'Finance Manager', desc: 'Finance & billing (subscription, payments)' },
  { value: 'MARKETING_MANAGER' as const, label: 'Marketing', desc: 'Campaigns, bulk emails' },
  { value: 'SUPPORT_MANAGER' as const, label: 'Support', desc: 'Tickets, customer support' },
  { value: 'OPERATIONS_MANAGER' as const, label: 'Operations', desc: 'Orders, inventory, logistics' },
];

interface OrgMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Permissions {
  invite_team?: boolean;
  manage_billing?: boolean;
  manage_finance?: boolean;
  edit_branding?: boolean;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  stage: string;
  source: string;
  next_action?: string;
  created_at: string;
}

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  contact_email?: string;
  message?: string;
  status: string;
  priority: string;
  assignee?: string;
  source?: string;
  created_at: string;
}

function SalesChart({ weeklyData }: { weeklyData: number[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartInstanceRef = useRef<any>(null);
  const data = weeklyData.length >= 7 ? weeklyData : [0, 0, 0, 0, 0, 0, 0];
  useEffect(() => {
    // Destroy any existing instance first to avoid "Canvas already in use" error
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
    import('chart.js/auto').then((Chart) => {
      if (!chartRef.current) return;
      // Also destroy any orphaned chart attached to this canvas element
      const existing = (Chart.default as unknown as { getChart?: (canvas: HTMLCanvasElement) => { destroy(): void } | undefined }).getChart?.(chartRef.current);
      if (existing) existing.destroy();
      chartInstanceRef.current = new Chart.default(chartRef.current, {
        type: 'line',
        data: {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          datasets: [{
            data,
            borderColor: '#10b981',
            borderWidth: 3,
            pointRadius: 0,
            fill: true,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            tension: 0.4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } },
          },
        },
      });
    });
    return () => {
      chartInstanceRef.current?.destroy();
      chartInstanceRef.current = null;
    };
  }, [data.join(',')]);
  return (
    <div className="h-[80px] w-full">
      <canvas ref={chartRef} />
    </div>
  );
}

function DroppableColumn({ id, children, className }: { id: string; children: React.ReactNode; className?: string }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className || ''} ${isOver ? 'ring-2 ring-indigo-400 ring-opacity-50' : ''}`}>
      {children}
    </div>
  );
}

function DraggableCard({ lead, pipelineStages, onStageChange, onSelect, isDragging }: {
  lead: Lead; pipelineStages: string[]; onStageChange: (leadId: string, stage: string) => void; onSelect: () => void; isDragging?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: lead.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onSelect}
      className={`p-3 bg-white rounded-lg border border-slate-200 text-sm cursor-grab active:cursor-grabbing hover:border-emerald-300 transition-colors ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
      onClickCapture={(e) => { if ((e.target as HTMLElement).tagName === 'SELECT' || (e.target as HTMLElement).closest('select')) e.stopPropagation(); }}>
      <p className="font-medium text-slate-900 truncate">{lead.name}</p>
      <p className="text-xs text-slate-500 truncate">{lead.company || lead.email}</p>
      <select value={pipelineStages.includes(lead.stage || '') ? lead.stage : pipelineStages[0]} onChange={(e) => onStageChange(lead.id, e.target.value)} className="mt-2 w-full text-xs border border-slate-200 rounded px-2 py-1" onClick={(e) => e.stopPropagation()}>
        {pipelineStages.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
      </select>
      <div className="mt-2 flex gap-1">
        {lead.email && <a href={`mailto:${lead.email}`} className="p-1 rounded hover:bg-slate-100" title="Email" onClick={(e) => e.stopPropagation()}><Mail size={12} /></a>}
        {lead.phone && <a href={`tel:${lead.phone}`} className="p-1 rounded hover:bg-slate-100" title="Call" onClick={(e) => e.stopPropagation()}><Phone size={12} /></a>}
      </div>
    </div>
  );
}

function KanbanPipeline({ pipelineStages, leadsByStage, stageForLead, updateLeadStage, setSelectedLead, setLeadNextAction }: {
  pipelineStages: string[];
  leadsByStage: Record<string, Lead[]>;
  stageForLead: (l: Lead) => string;
  updateLeadStage: (leadId: string, stage: string) => void;
  setSelectedLead: (l: Lead) => void;
  setLeadNextAction: (s: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const handleDragEnd = (e: DragEndEvent) => {
    const leadId = e.active.id as string;
    const overId = String(e.over?.id || '');
    let targetStage = pipelineStages.includes(overId) ? overId : null;
    if (!targetStage) {
      const overLead = Object.values(leadsByStage).flat().find((l) => l.id === overId);
      if (overLead) targetStage = stageForLead(overLead);
    }
    if (targetStage) updateLeadStage(leadId, targetStage);
  };
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[420px]">
        {pipelineStages.map((stage) => (
          <DroppableColumn key={stage} id={stage} className={`flex-shrink-0 w-52 rounded-xl p-4 flex flex-col border shadow-sm ${stage === 'LOST' ? 'bg-red-50/50 border-red-200' : 'bg-slate-50/80 border-slate-200'}`}>
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
              <span className="font-bold text-xs text-slate-600 uppercase">{stage.replace(/_/g, ' ')}</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{leadsByStage[stage]?.length || 0}</span>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto min-h-[120px]">
              {(leadsByStage[stage] || []).map((l) => (
                <DraggableCard key={l.id} lead={l} pipelineStages={pipelineStages} onStageChange={updateLeadStage}
                  onSelect={() => { setSelectedLead(l); setLeadNextAction(l.next_action || ''); }} />
              ))}
            </div>
          </DroppableColumn>
        ))}
      </div>
    </DndContext>
  );
}

function computeNextBestAction(leads: Lead[]): { message: string; cta: string; tab: Tab } | null {
  const byStage = (s: string) => leads.filter((l) => (l.stage || 'NEW') === s).length;
  const proposal = byStage('PROPOSAL');
  const negotiation = byStage('NEGOTIATION');
  const discovery = byStage('DISCOVERY');
  const strategy = byStage('STRATEGY_SESSION');
  if (proposal >= 2) return { message: `${proposal} leads in Proposal – follow up?`, cta: 'View pipeline', tab: 'crm' as Tab };
  if (negotiation >= 1) return { message: `${negotiation} lead(s) in Negotiation – close the deal?`, cta: 'View pipeline', tab: 'crm' as Tab };
  if (strategy >= 2) return { message: `${strategy} in Strategy Session – send proposal?`, cta: 'Go to CRM', tab: 'crm' as Tab };
  if (discovery >= 3) return { message: `${discovery} leads in Discovery – qualify and advance`, cta: 'View leads', tab: 'crm' as Tab };
  if (leads.length === 0) return { message: 'No leads yet – get them from your site or ads', cta: 'Setup website', tab: 'website' as Tab };
  return null;
}

function BentoHome({ userName, orgName, leadCount, topLeads, leads, serviceHours, productRevenue, weeklyRevenue, onNavigate, aiInsightsOpen, onAiInsightsOpen, onAiInsightsClose, orgId }: {
  userName: string;
  orgName: string;
  leadCount: number;
  topLeads: Lead[];
  leads: Lead[];
  serviceHours: number;
  productRevenue: number;
  weeklyRevenue: number[];
  onNavigate: (tab: Tab) => void;
  aiInsightsOpen?: boolean;
  onAiInsightsOpen?: () => void;
  onAiInsightsClose?: () => void;
  orgId?: string;
}) {
  const nudge = computeNextBestAction(leads);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = userName.split(' ')[0] || 'there';
  const newToday = leads.filter(l => { try { return new Date(l.created_at).toDateString() === new Date().toDateString(); } catch { return false; } }).length;
  const wonCount = leads.filter(l => (l.stage || '').toUpperCase() === 'WON').length;
  const sourceCounts = leads.reduce((acc, l) => { const s = (l.source || 'WEBSITE').toUpperCase(); acc[s] = (acc[s] || 0) + 1; return acc; }, {} as Record<string, number>);
  const siteUrl = typeof window !== 'undefined' && orgId ? `${window.location.origin}/site/${orgId}` : orgId ? `/site/${orgId}` : '';
  const stageColors: Record<string, string> = { NEW: 'bg-blue-100 text-blue-700', QUALIFIED: 'bg-indigo-100 text-indigo-700', PROPOSAL: 'bg-purple-100 text-purple-700', WON: 'bg-emerald-100 text-emerald-700', LOST: 'bg-red-100 text-red-600', DISCOVERY: 'bg-cyan-100 text-cyan-700', NEGOTIATION: 'bg-amber-100 text-amber-700', CONTRACT_SIGNED: 'bg-teal-100 text-teal-700' };
  const srcEmoji: Record<string, string> = { WEBSITE: '🌐', FACEBOOK_AD: '📘', GOOGLE_AD: '🔍', INSTAGRAM: '📸', MANUAL: '✍️', REFERRAL: '🤝' };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{greeting}, {firstName}! 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">{orgName}. Here&apos;s your business overview</p>
        </div>
        <p className="text-xs text-slate-400 hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Live site banner */}
      {orgId && (
        <div className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
            <div>
              <p className="font-semibold text-sm text-slate-900">Your website is live</p>
              <p className="text-xs text-slate-400 font-mono truncate max-w-[260px]">{siteUrl}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => { if (typeof navigator !== 'undefined') navigator.clipboard?.writeText(siteUrl); }} className="text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">Copy link</button>
            <a href={`/site/${orgId}`} target="_blank" rel="noopener noreferrer" className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-colors" style={{ background: '#163A63' }}>Preview →</a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: leadCount, delta: newToday > 0 ? `+${newToday} today` : null },
          { label: 'New Today', value: newToday, delta: null },
          { label: 'Won Deals', value: wonCount, delta: leadCount > 0 ? `${Math.round((wonCount / leadCount) * 100)}% win rate` : null },
          { label: 'Revenue', value: `$${productRevenue.toLocaleString()}`, delta: null },
        ].map((s, i) => (
          <button key={s.label} onClick={() => onNavigate('crm')}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">{s.value}</p>
            {s.delta && <p className="text-[11px] text-emerald-600 font-semibold mt-1">{s.delta}</p>}
          </button>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Recent Leads</h3>
            <button onClick={() => onNavigate('crm')} className="text-xs text-slate-500 font-semibold hover:text-slate-900 flex items-center gap-1 transition-colors">View pipeline <ArrowRight size={11} /></button>
          </div>
          {leads.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <ArrowRight size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No leads yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">Share your website link and leads will appear here automatically</p>
              <button onClick={() => onNavigate('website')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-xl transition-colors" style={{ background: '#163A63' }}>Set up website →</button>
            </div>
          ) : (
            <div className="space-y-1">
              {leads.slice(0, 6).map(l => (
                <div key={l.id} onClick={() => onNavigate('crm')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: '#163A63' }}>
                    {(l.name[0] || '?').toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{l.name}</p>
                    <p className="text-xs text-slate-400 truncate">{l.company || l.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span title={l.source || 'WEBSITE'}>{srcEmoji[(l.source || 'WEBSITE').toUpperCase()] || '🌐'}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stageColors[(l.stage || 'NEW').toUpperCase()] || 'bg-slate-100 text-slate-600'}`}>{l.stage || 'NEW'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {nudge ? (
            <button onClick={() => onNavigate(nudge.tab)} className="w-full text-white rounded-xl p-5 text-left hover:opacity-90 transition-opacity shadow-md" style={{ background: '#163A63' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Action needed</p>
              <p className="font-semibold text-sm leading-snug">{nudge.message}</p>
              <p className="text-xs mt-3 opacity-60 flex items-center gap-1">{nudge.cta} <ArrowRight size={10} /></p>
            </button>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status</p>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${leadCount > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <p className="font-semibold text-sm text-slate-900">{leadCount > 0 ? 'Pipeline active' : 'Ready to launch'}</p>
              </div>
              <p className="text-xs text-slate-400">{leadCount > 0 ? `${leadCount} leads in pipeline` : 'Share your site to get your first lead'}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Add Lead', tab: 'crm' as Tab },
              { label: 'Email Leads', tab: 'marketing' as Tab },
              { label: 'Edit Site', tab: 'website' as Tab },
              { label: 'Settings', tab: 'settings' as Tab },
            ].map(a => (
              <button key={a.label} onClick={() => onNavigate(a.tab)}
                className="bg-white border border-slate-200 rounded-xl p-3 text-left hover:bg-slate-50 hover:border-slate-300 transition-all">
                <p className="text-xs font-semibold text-slate-700">{a.label}</p>
              </button>
            ))}
          </div>

          {leads.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Lead Sources</p>
              <div className="space-y-2.5">
                {Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([src, count]) => (
                  <div key={src} className="flex items-center gap-2">
                    <span className="text-sm w-4 text-center">{srcEmoji[src] || '📌'}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-1.5 rounded-full" style={{ width: `${Math.round((count / leads.length) * 100)}%`, background: '#163A63' }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium w-16 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Revenue (7 days)</p>
            <p className="text-2xl font-bold text-slate-900">${productRevenue.toLocaleString()}</p>
            <div className="mt-3 h-[52px]"><SalesChart weeklyData={weeklyRevenue} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [onboarding, setOnboarding] = useState(false);
  const [user, setUser] = useState<{ id: string; email?: string; user_metadata?: { name?: string; company?: string } } | null>(null);
  const [org, setOrg] = useState<{ id: string; name: string } | null>(null);
  const [tab, setTab] = useState<Tab>('website');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [inviteRole, setInviteRole] = useState<(typeof INVITEABLE_ROLES)[number]['value']>('SALES_AGENT');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadNotes, setLeadNotes] = useState<{ leadId: string; note: string; performedBy: string; createdAt: string }[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [websiteSubTab, setWebsiteSubTab] = useState<WebsiteSubTab>('preview');
  const [branding, setBranding] = useState({
    company_name: '', logo_url: '', primary_color: '#163A63', phone: '', whatsapp: '', address: '',
    info_email: '', support_email: '', sales_email: '', contact_email: '',
    instagram_url: '', facebook_url: '', business_type: 'product' as 'product' | 'service',
    facebook_pixel_id: '', ga_id: '', auto_welcome_email: false,
  });
  const [websiteCms, setWebsiteCms] = useState({
    hero_title: '', hero_subtitle: '', value_line: '', process_title: '', process_subtitle: '',
    about_title: '', about_body1: '', about_body2: '', stock_quote_title: '', stock_quote_subtitle: '',
  });
  const [supportFilter, setSupportFilter] = useState<'ALL' | 'ESCALATIONS' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [ticketForm, setTicketForm] = useState<{ subject: string; customer: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; assignee: string; source: 'MANUAL' | 'LEAD_ESCALATION' | 'CUSTOMER_PORTAL' | 'WEBSITE' }>({ subject: '', customer: '', priority: 'MEDIUM', assignee: '', source: 'MANUAL' });
  const [addLeadModal, setAddLeadModal] = useState(false);
  const [addLeadForm, setAddLeadForm] = useState({ name: '', company: '', email: '', phone: '' });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNextAction, setLeadNextAction] = useState('');
  const [leadNote, setLeadNote] = useState('');
  const [marketingCompose, setMarketingCompose] = useState({ subject: '', body: '', recipientIds: [] as string[] });
  const [marketingSending, setMarketingSending] = useState(false);
  const [marketingSentCount, setMarketingSentCount] = useState(0);
  const [logoUploading, setLogoUploading] = useState(false);
  const [crmSubTab, setCrmSubTab] = useState<CrmSubTab>('pipeline');
  const [crmViewType, setCrmViewType] = useState<CrmViewType>('deals');
  const [crmSearch, setCrmSearch] = useState('');
  const [crmSourceFilter, setCrmSourceFilter] = useState<string>('ALL');
  const [supportNewTicketOpen, setSupportNewTicketOpen] = useState(false);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [addProjectForm, setAddProjectForm] = useState({ name: '', credits: 0 });
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);
  const [newLeadsDot, setNewLeadsDot] = useState(false);
  const [websitePreviewKey, setWebsitePreviewKey] = useState(0);
  const [aiGenerateLoading, setAiGenerateLoading] = useState(false);
  const [showAiInsightsModal, setShowAiInsightsModal] = useState(false);
  const [serviceProjects, setServiceProjects] = useState<{ id: string; name: string; status: string; credits_total: number; lead_id?: string }[]>([]);
  const [orders, setOrders] = useState<{ id: string; total: number; status: string; created_at: string }[]>([]);
  const [currentPlan, setCurrentPlan] = useState<'free_trial' | 'starter' | 'business' | 'pro'>('free_trial');
  const [trialDaysLeft, setTrialDaysLeft] = useState(14);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileSaved, setProfileSaved] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [dangerZoneConfirm, setDangerZoneConfirm] = useState('');
  const [showDangerZone, setShowDangerZone] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }
    const run = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        router.replace('/auth/signin');
        return;
      }
      setUser(session.user);
      setProfileForm({ name: session.user.user_metadata?.name || '', email: session.user.email || '' });

      const { data: tm } = await client.from('team_members').select('org_id').eq('user_id', session.user.id).limit(1).maybeSingle();
      if (!tm) {
        setOnboarding(true);
        const company = (session.user.user_metadata?.company as string) || 'My Business';
        const name = (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'User';
        const orgId = 'ORG-' + Math.random().toString(36).slice(2, 10).toUpperCase();
        await client.from('organizations').insert({ id: orgId, name: company });
        await client.from('team_members').insert({
          org_id: orgId, user_id: session.user.id, name, email: session.user.email || '', role: 'OWNER', status: 'ACTIVE',
        });
        await client.from('branding').insert({
          org_id: orgId, company_name: company,
        });
        try { await client.from('website_cms').insert({ org_id: orgId }); } catch (_) {}
        await client.from('user_organizations').insert({
          user_id: session.user.id, org_id: orgId, role: 'OWNER',
        });
        try {
          await client.from('role_permissions').insert({
            org_id: orgId, role: 'OWNER',
            invite_team: true, manage_billing: true, manage_finance: true, edit_branding: true,
            delete_leads: true, delete_orders: true, add_pipeline_stages: true, edit_quotes: true, edit_templates: true,
          });
        } catch (_) {}
        setOrg({ id: orgId, name: company });
        setPermissions({ invite_team: true, manage_billing: true, manage_finance: true, edit_branding: true });
        setOnboarding(false);
        setLoading(false);
        return;
      }
      const orgId = tm.org_id;
      const { data: orgData } = await client.from('organizations').select('id, name').eq('id', orgId).single();
      if (orgData) setOrg(orgData);

      const { data: myTm } = await client.from('team_members').select('role').eq('org_id', orgId).eq('user_id', session.user.id).single();
      const role = myTm?.role;
      if (role) {
        const { data: perms } = await client.from('role_permissions').select('invite_team, manage_billing, manage_finance, edit_branding')
          .eq('org_id', orgId).eq('role', role).maybeSingle();
        setPermissions({
          invite_team: perms?.invite_team ?? false,
          manage_billing: perms?.manage_billing ?? false,
          manage_finance: perms?.manage_finance ?? false,
          edit_branding: perms?.edit_branding ?? false,
        });
      }

      const { data: m } = await client.from('team_members').select('id, name, email, role').eq('org_id', orgId).order('created_at');
      setMembers(m || []);

      const [leadsRes, ticketsRes, brandRes, cmsRes, projectsSettled, ordersSettled] = await Promise.all([
        client.from('leads').select('id, name, email, company, phone, stage, source, next_action, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200),
        client.from('tickets').select('id, subject, customer, contact_email, message, status, priority, assignee, source, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200),
        client.from('branding').select('*').eq('org_id', orgId).maybeSingle(),
        client.from('website_cms').select('*').eq('org_id', orgId).maybeSingle(),
        (async () => { try { const r = await client.from('service_projects').select('id, name, status, credits_total, lead_id').eq('org_id', orgId).order('created_at', { ascending: false }).limit(100); return r.data || []; } catch { return []; } })(),
        (async () => { try { const r = await client.from('orders').select('id, total, status, created_at').eq('org_id', orgId).order('created_at', { ascending: false }).limit(200); return r.data || []; } catch { return []; } })(),
      ]);
      const l = leadsRes.data || [];
      setLeads(l.map((x: Record<string, unknown>) => ({
        id: String(x.id), name: String(x.name || ''), email: String(x.email || ''), company: String(x.company || ''),
        phone: String((x.phone as string) || ''), stage: String(x.stage || 'NEW'), source: String(x.source || ''),
        next_action: String((x.next_action as string) || ''), created_at: String(x.created_at || ''),
      })));
      const t = ticketsRes.data || [];
      setTickets(t.map((x: Record<string, unknown>) => ({
        id: String(x.id), subject: String(x.subject || ''), customer: String(x.customer || ''),
        contact_email: (x.contact_email as string) || undefined, message: (x.message as string) || undefined,
        status: String(x.status || 'OPEN'), priority: String(x.priority || 'MEDIUM'),
        assignee: (x.assignee as string) || undefined, source: (x.source as string) || undefined,
        created_at: String(x.created_at || ''),
      })));
      const b = brandRes.data;
      if (b) {
        const rb = b as Record<string, unknown>;
        setBranding({
          company_name: String(rb.company_name || orgData?.name || ''),
          logo_url: String(rb.logo_url || ''),
          primary_color: String(rb.primary_color || '#163A63'),
          phone: String(rb.phone || ''),
          whatsapp: String(rb.whatsapp || ''),
          address: String(rb.address || ''),
          info_email: String(rb.info_email || ''),
          support_email: String(rb.support_email || ''),
          sales_email: String(rb.sales_email || ''),
          contact_email: String(rb.contact_email || ''),
          instagram_url: String(rb.instagram_url || ''),
          facebook_url: String(rb.facebook_url || ''),
          business_type: (rb.business_type === 'service' ? 'service' : 'product') as 'product' | 'service',
          facebook_pixel_id: String(rb.facebook_pixel_id || ''),
          ga_id: String(rb.ga_id || ''),
          auto_welcome_email: Boolean(rb.auto_welcome_email || false),
        });
      }
      const projects = Array.isArray(projectsSettled) ? projectsSettled : [];
      setServiceProjects(projects.map((p: Record<string, unknown>) => ({
        id: String(p.id), name: String(p.name || 'Project'), status: String(p.status || 'ACTIVE'),
        credits_total: Number(p.credits_total || 0), lead_id: p.lead_id ? String(p.lead_id) : undefined,
      })));
      const ords = Array.isArray(ordersSettled) ? ordersSettled : [];
      setOrders(ords.map((o: Record<string, unknown>) => ({
        id: String(o.id), total: Number(o.total || 0), status: String(o.status || ''),
        created_at: String(o.created_at || ''),
      })));

      const c = cmsRes.data;
      if (c) {
        const rc = c as Record<string, unknown>;
        setWebsiteCms({
          hero_title: String(rc.hero_title || 'Build your business online'),
          hero_subtitle: String(rc.hero_subtitle || 'We help you grow.'),
          value_line: String(rc.value_line || 'Simple. Modern. Effective.'),
          process_title: String(rc.process_title || 'How we help'),
          process_subtitle: String(rc.process_subtitle || ''),
          about_title: String(rc.about_title || 'About us'),
          about_body1: String(rc.about_body1 || ''),
          about_body2: String(rc.about_body2 || ''),
          stock_quote_title: String(rc.stock_quote_title || 'Get in touch'),
          stock_quote_subtitle: String(rc.stock_quote_subtitle || "Leave your details and we'll reach out."),
        });
      }
      setLoading(false);
    };
    run();
  }, [router]);

  useEffect(() => {
    const client = supabase;
    if (!client || !org?.id) return;
    const channel = client.channel(`leads-${org.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads', filter: `org_id=eq.${org.id}` }, (payload) => {
      const r = payload.new as Record<string, unknown>;
      if (r && typeof r.id === 'string') {
        setLeads(prev => {
          if (prev.some(l => l.id === r.id)) return prev;
          return [{
            id: String(r.id), name: String(r.name || ''), email: String(r.email || ''), company: String(r.company || ''),
            phone: String((r.phone as string) || ''), stage: String(r.stage || 'NEW'), source: String(r.source || ''),
            next_action: String((r.next_action as string) || ''), created_at: String(r.created_at || ''),
          }, ...prev];
        });
        setNewLeadsDot(true);
      }
    }).subscribe();
    return () => { client.removeChannel(channel); };
  }, [supabase, org?.id]);

  useEffect(() => {
    if (tab === 'crm') setNewLeadsDot(false);
  }, [tab]);

  const handleInvite = async () => {
    if (!supabase || !org || !inviteEmail.trim()) return;
    setInviteLoading(true);
    try {
      await supabase.from('invites').insert({
        org_id: org.id, email: inviteEmail.trim(), name: inviteEmail.split('@')[0], role: inviteRole, status: 'INVITED',
      });
      setInviteEmail('');
    } catch (_) {}
    setInviteLoading(false);
  };

  const saveBranding = async () => {
    if (!supabase || !org || !permissions.edit_branding) return;
    try {
      await supabase.from('branding').upsert({
        org_id: org.id, company_name: branding.company_name, logo_url: branding.logo_url || null,
        primary_color: branding.primary_color || '#163A63', phone: branding.phone || null, whatsapp: branding.whatsapp || null,
        address: branding.address || null, info_email: branding.info_email || null, support_email: branding.support_email || null,
        sales_email: branding.sales_email || null, contact_email: branding.contact_email || null,
        instagram_url: branding.instagram_url || null, facebook_url: branding.facebook_url || null,
        business_type: branding.business_type || 'product', updated_at: new Date().toISOString(),
        facebook_pixel_id: branding.facebook_pixel_id || null, ga_id: branding.ga_id || null,
        auto_welcome_email: branding.auto_welcome_email || false,
      }, { onConflict: 'org_id' });
      setSettingsSaved(true);
      setWebsitePreviewKey(k => k + 1);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.warn('Save branding failed:', e);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !org || !supabase) return;
    setLogoUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${org.id}/logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('site-images').upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('site-images').getPublicUrl(path);
      const logoUrl = urlData.publicUrl;
      setBranding(b => ({ ...b, logo_url: logoUrl }));
      // Save immediately
      await supabase.from('branding').upsert({ org_id: org.id, logo_url: logoUrl }, { onConflict: 'org_id' });
      setWebsitePreviewKey(k => k + 1);
    } catch (err) {
      console.warn('Logo upload failed:', err);
    } finally {
      setLogoUploading(false);
      e.target.value = '';
    }
  };

  const generateAICopy = async (type: 'hero' | 'about' | 'tagline') => {
    const prompt = branding.company_name || org?.name || 'our business';
    setAiGenerateLoading(true);
    try {
      const res = await fetch('/api/generate-copy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, type }) });
      const data = await res.json();
      if (data.headline) setWebsiteCms(c => ({ ...c, hero_title: data.headline, hero_subtitle: data.subheadline || c.hero_subtitle }));
      else if (data.body) setWebsiteCms(c => ({ ...c, about_body1: data.body }));
      else if (data.tagline) setWebsiteCms(c => ({ ...c, value_line: data.tagline }));
    } catch (_) {}
    setAiGenerateLoading(false);
  };

  const applyTemplate = async (key: keyof typeof WEBSITE_TEMPLATES) => {
    const t = WEBSITE_TEMPLATES[key];
    const next = {
      ...websiteCms,
      hero_title: t.hero_title,
      hero_subtitle: t.hero_subtitle,
      value_line: t.value_line,
      process_title: t.process_title,
      process_subtitle: t.process_subtitle,
      about_title: t.about_title,
      about_body1: t.about_body1,
      about_body2: t.about_body2,
      stock_quote_title: t.stock_quote_title,
      stock_quote_subtitle: t.stock_quote_subtitle,
    };
    setWebsiteCms(next);
    if (supabase && org && permissions.edit_branding) {
      try {
        await supabase.from('website_cms').upsert({
          org_id: org.id, hero_title: next.hero_title, hero_subtitle: next.hero_subtitle,
          value_line: next.value_line || null, process_title: next.process_title,
          process_subtitle: next.process_subtitle || null, about_title: next.about_title,
          about_body1: next.about_body1 || null, about_body2: next.about_body2 || null,
          stock_quote_title: next.stock_quote_title, stock_quote_subtitle: next.stock_quote_subtitle || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'org_id' });
        setSettingsSaved(true);
        setWebsitePreviewKey(k => k + 1);
        setTimeout(() => setSettingsSaved(false), 2000);
      } catch (_) {}
    }
  };

  const saveWebsiteCms = async () => {
    if (!supabase || !org || !permissions.edit_branding) return;
    try {
      await supabase.from('website_cms').upsert({
        org_id: org.id, hero_title: websiteCms.hero_title, hero_subtitle: websiteCms.hero_subtitle,
        value_line: websiteCms.value_line || null, process_title: websiteCms.process_title,
        process_subtitle: websiteCms.process_subtitle || null, about_title: websiteCms.about_title,
        about_body1: websiteCms.about_body1 || null, about_body2: websiteCms.about_body2 || null,
        stock_quote_title: websiteCms.stock_quote_title, stock_quote_subtitle: websiteCms.stock_quote_subtitle || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'org_id' });
      setSettingsSaved(true);
      setWebsitePreviewKey(k => k + 1);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch (e) {
      console.warn('Save website CMS failed:', e);
    }
  };

  const updateLeadStage = async (leadId: string, stage: string) => {
    if (!supabase || !org) return;
    const lead = leads.find(l => l.id === leadId);
    const prevStage = lead?.stage;
    setLeads(l => l.map(x => x.id === leadId ? { ...x, stage } : x));
    const { error } = await supabase.from('leads').update({ stage }).eq('id', leadId);
    if (error && lead) setLeads(l => l.map(x => x.id === leadId ? { ...x, stage: prevStage || 'NEW' } : x));
    else if (!error && lead && (stage === 'WON' || stage === 'CONTRACT_SIGNED')) {
      await supabase.from('service_projects').insert({
        org_id: org.id, lead_id: leadId, name: `${lead.company || lead.name} - Project`, status: 'ACTIVE',
      }).then(() => {});
    }
  };

  const updateLeadNextAction = async (leadId: string, nextAction: string) => {
    if (!supabase) return;
    await supabase.from('leads').update({ next_action: nextAction }).eq('id', leadId);
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, next_action: nextAction } : l));
  };

  const createQuoteFromLead = async () => {
    if (!supabase || !org || !selectedLead) return;
    const id = `QT-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    const createdBy = user?.email || user?.id || 'user';
    const performer = user?.user_metadata?.name as string || user?.email || 'User';
    try {
      await supabase.from('quotes').insert({
        id, org_id: org.id, lead_id: selectedLead.id, customer_name: selectedLead.name, customer_company: selectedLead.company || '',
        customer_email: selectedLead.email, customer_phone: selectedLead.phone || '', total: 0, status: 'DRAFT', items_json: [],
        created_by: createdBy,
      });
      await supabase.from('activity_log').insert({
        org_id: org.id, action: 'NOTE', entity_type: 'LEAD', entity_id: selectedLead.id,
        details: { note: `Created quote ${id} (draft)` }, performed_by: performer,
      });
      setLeadNotes(prev => [{ leadId: selectedLead.id, note: `Created quote ${id}`, performedBy: performer, createdAt: new Date().toISOString() }, ...prev]);
    } catch (_) {}
  };

  const addLeadNote = async () => {
    if (!supabase || !org || !selectedLead || !leadNote.trim()) return;
    const performer = user?.user_metadata?.name as string || user?.email || 'User';
    await supabase.from('activity_log').insert({
      org_id: org.id, action: 'NOTE', entity_type: 'LEAD', entity_id: selectedLead.id,
      details: { note: leadNote.trim() }, performed_by: performer,
    });
    setLeadNotes(prev => [{ leadId: selectedLead.id, note: leadNote.trim(), performedBy: performer, createdAt: new Date().toISOString() }, ...prev]);
    setLeadNote('');
  };

  useEffect(() => {
    if (!supabase || !selectedLead || !org) { setLeadNotes([]); return; }
    supabase.from('activity_log').select('id, entity_id, action, details, performed_by, created_at')
      .eq('org_id', org.id).eq('entity_type', 'LEAD').eq('entity_id', selectedLead.id)
      .order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => {
        setLeadNotes((data || []).map((r: Record<string, unknown>) => ({
          leadId: String(r.entity_id), note: String((r.details as { note?: string })?.note || ''),
          performedBy: String(r.performed_by || ''), createdAt: String(r.created_at || ''),
        })));
      });
  }, [selectedLead?.id, org?.id, supabase]);

  const sendBulkEmail = async () => {
    if (!marketingCompose.subject.trim() || !marketingCompose.body.trim()) return;
    const toSend = marketingCompose.recipientIds.length > 0
      ? leads.filter(l => marketingCompose.recipientIds.includes(l.id))
      : leads;
    if (toSend.length === 0) return;
    setMarketingSending(true);
    for (const lead of toSend) {
      try {
        await fetch('/api/send-email', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: lead.email,
            subject: marketingCompose.subject,
            body: marketingCompose.body.replace(/\{name\}/g, lead.name.split(' ')[0] || lead.name).replace(/\{company\}/g, lead.company || ''),
          }),
        });
      } catch (_) {}
    }
    setMarketingSending(false);
    setMarketingSentCount(toSend.length);
    setMarketingCompose({ subject: '', body: '', recipientIds: [] });
    setTimeout(() => setMarketingSentCount(0), 5000);
  };

  const addLead = async () => {
    if (!supabase || !org || !addLeadForm.name.trim() || !addLeadForm.email.trim()) return;
    const defaultStage = crmViewType === 'consulting' ? 'DISCOVERY' : 'NEW';
    try {
      await supabase.from('leads').insert({
        org_id: org.id, name: addLeadForm.name.trim(), company: addLeadForm.company.trim() || 'Website',
        email: addLeadForm.email.trim(), phone: addLeadForm.phone.trim() || '', stage: defaultStage, source: 'MANUAL',
      });
      setAddLeadForm({ name: '', company: '', email: '', phone: '' });
      setAddLeadModal(false);
      const { data } = await supabase.from('leads').select('id, name, email, company, phone, stage, source, next_action, created_at')
        .eq('org_id', org.id).order('created_at', { ascending: false }).limit(1).single();
      if (data) {
        const d = data as Record<string, unknown>;
        setLeads(prev => [{
          id: String(d.id), name: String(d.name || ''), email: String(d.email || ''), company: String(d.company || ''),
          phone: String((d.phone as string) || ''), stage: String(d.stage || defaultStage), source: String(d.source || ''),
          next_action: '', created_at: String(d.created_at || ''),
        }, ...prev]);
      }
    } catch (_) {}
  };

  const addTicket = async () => {
    if (!supabase || !org || !ticketForm.subject.trim() || !ticketForm.customer.trim()) return;
    const id = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    try {
      await supabase.from('tickets').insert({
        id, org_id: org.id, subject: ticketForm.subject.trim(), customer: ticketForm.customer.trim(),
        priority: ticketForm.priority, status: 'OPEN', assignee: ticketForm.assignee || null, source: ticketForm.source || 'MANUAL',
      });
      setTicketForm({ subject: '', customer: '', priority: 'MEDIUM', assignee: '', source: 'MANUAL' });
      setTickets(prev => [{ id, subject: ticketForm.subject.trim(), customer: ticketForm.customer.trim(), status: 'OPEN', priority: ticketForm.priority, assignee: ticketForm.assignee || undefined, source: ticketForm.source, created_at: new Date().toISOString() } as Ticket, ...prev]);
    } catch (_) {}
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    if (!supabase) return;
    await supabase.from('tickets').update({ status }).eq('id', ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
  };

  const updateTicketAssignee = async (ticketId: string, assignee: string) => {
    if (!supabase) return;
    await supabase.from('tickets').update({ assignee: assignee || null }).eq('id', ticketId);
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, assignee: assignee || undefined } : t));
  };

  const deleteTicket = async (ticketId: string) => {
    if (!supabase) return;
    await supabase.from('tickets').delete().eq('id', ticketId);
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const escalationTickets = tickets.filter(t => t.source === 'WEBSITE' || t.source === 'LEAD_ESCALATION');
  const visibleTickets = supportFilter === 'ALL'
    ? tickets
    : supportFilter === 'ESCALATIONS'
      ? escalationTickets
      : tickets.filter(t => t.status === supportFilter);

  const crmFilteredLeads = leads.filter(l => {
    const matchSearch = !crmSearch.trim() || [l.name, l.email, l.company, l.phone].some(v => String(v || '').toLowerCase().includes(crmSearch.toLowerCase()));
    const matchSource = crmSourceFilter === 'ALL' || (l.source || '').toUpperCase() === crmSourceFilter;
    return matchSearch && matchSource;
  });
  const pipelineStages = crmViewType === 'consulting' ? CONSULTING_STAGES : crmViewType === 'deals' ? DEALS_STAGES : [];
  const stageForLead = (l: Lead) => {
    const s = l.stage || 'NEW';
    return pipelineStages.includes(s) ? s : pipelineStages[0] || s;
  };
  const leadsByStage = pipelineStages.reduce((acc, s) => {
    acc[s] = crmFilteredLeads.filter(l => stageForLead(l) === s);
    return acc;
  }, {} as Record<string, Lead[]>);
  const sourceOptions = ['ALL', ...Array.from(new Set(leads.map(l => (l.source || 'MANUAL').toUpperCase())))];

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.replace('/');
  };

  if (loading || onboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <Loader2 className="animate-spin text-slate-400 mx-auto mb-4" size={40} />
          <p className="text-slate-600">{onboarding ? 'Setting up your workspace...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard; permission?: keyof Permissions }[] = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM', icon: Users },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'team', label: 'Team', icon: UserPlus },
    { id: 'billing', label: 'Plans & Billing', icon: CreditCard, permission: 'manage_billing' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'account', label: 'Account', icon: UserPlus },
  ];
  const nav = navItems.filter((n) => !n.permission || permissions[n.permission]);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      <aside className="w-56 bg-slate-900 text-white flex flex-col">
        <div className="p-4 border-b border-slate-800">
          <span className="font-bold text-lg">Stoklync</span>
        </div>
        <nav className="flex-1 p-2">
          {nav.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium mb-1 relative ${
                tab === id ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={18} /> {label}
              {id === 'crm' && newLeadsDot && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="New leads" />}
            </button>
          ))}
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <nav className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <h1 className="font-semibold text-slate-900">{navItems.find((n) => n.id === tab)?.label ?? 'Dashboard'}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.email}</span>
            <button onClick={handleSignOut} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </nav>
        <main className="flex-1 p-6 overflow-auto">
          {tab === 'home' && (() => {
            const paidOrders = orders.filter(o => ['PAID', 'FULFILLED', 'CONFIRMED', 'DELIVERED', 'PROCESSING'].includes((o.status || '').toUpperCase()));
            const productRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
            const serviceHours = serviceProjects.reduce((s, p) => s + (p.credits_total || 0), 0);
            const now = new Date();
            const weeklyRevenue = [0, 1, 2, 3, 4, 5, 6].map(d => {
              const day = new Date(now);
              day.setDate(day.getDate() - (6 - d));
              const dayStr = day.toISOString().slice(0, 10);
              return paidOrders.filter(o => o.created_at?.slice(0, 10) === dayStr).reduce((s, o) => s + o.total, 0);
            });
            return (
              <BentoHome
                userName={user?.user_metadata?.name || 'there'}
                orgName={org?.name || ''}
                leadCount={leads.length}
                topLeads={leads.slice(0, 2)}
                leads={leads}
                serviceHours={serviceHours}
                productRevenue={productRevenue}
                weeklyRevenue={weeklyRevenue}
                onNavigate={(t: Tab) => setTab(t)}
                aiInsightsOpen={showAiInsightsModal}
                onAiInsightsOpen={() => setShowAiInsightsModal(true)}
                onAiInsightsClose={() => setShowAiInsightsModal(false)}
                orgId={org?.id}
              />
            );
          })()}
          {tab === 'website' && (
            <div className="max-w-4xl">
              <div className="flex flex-wrap gap-1.5 mb-6 border-b border-slate-200 pb-4">
                {([
                  { id: 'visual',   label: 'Page Builder' },
                  { id: 'preview',  label: 'Live Preview' },
                  { id: 'branding', label: 'Brand & Colours' },
                  { id: 'contact',  label: 'Contact Info' },
                  { id: 'cms',      label: 'Site Content' },
                ] as const).map(({ id, label }) => (
                  <button key={id} onClick={() => setWebsiteSubTab(id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${websiteSubTab === id ? 'text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                    style={websiteSubTab === id ? { background: '#163A63' } : {}}>
                    {label}
                  </button>
                ))}
              </div>
              {websiteSubTab === 'preview' && org && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-slate-600 text-sm">Live preview</p>
                    <div className="flex gap-2">
                      <button onClick={() => setWebsitePreviewKey(k => k + 1)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm hover:bg-slate-50">Refresh</button>
                      <a href={`/site/${org.id}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800">
                        <ExternalLink size={16} /> Open in new tab
                      </a>
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm" style={{ aspectRatio: '16/10', minHeight: 400 }}>
                    <iframe key={websitePreviewKey} src={`/site/${org.id}?preview=1`} className="w-full h-full border-0" title="Site preview" />
                  </div>
                </div>
              )}
              {websiteSubTab === 'branding' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-800 mb-1">Brand Identity</h3>
                    <p className="text-sm text-slate-500 mb-5">Your logo, colours and business type shape how your website looks.</p>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Company name</label>
                        <input type="text" value={branding.company_name} onChange={e => setBranding({ ...branding, company_name: e.target.value })} placeholder="e.g. Acme Co." className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Logo</label>
                        <div className="flex items-start gap-4">
                          {branding.logo_url ? (
                            <div className="relative shrink-0">
                              <img src={branding.logo_url} alt="Logo" className="h-16 max-w-[180px] object-contain rounded-xl border border-slate-200 p-2 bg-white" onError={(e) => (e.currentTarget.style.display = 'none')} />
                              <button type="button" onClick={() => setBranding({ ...branding, logo_url: '' })} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs leading-none hover:bg-red-600">×</button>
                            </div>
                          ) : (
                            <div className="w-20 h-16 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                              <ImagePlus size={20} />
                            </div>
                          )}
                          <div className="flex-1">
                            <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium cursor-pointer hover:bg-slate-50 transition-colors ${logoUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                              {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                              {logoUploading ? 'Uploading…' : 'Upload logo'}
                              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                            </label>
                            <p className="text-xs text-slate-500 mt-2">PNG or SVG with transparent background recommended. Max 2 MB.</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand colour</label>
                        <div className="flex gap-3 items-center">
                          <input type="color" value={branding.primary_color || '#163A63'} onChange={e => setBranding({ ...branding, primary_color: e.target.value })} className="w-14 h-12 rounded-xl border border-slate-200 cursor-pointer p-1" />
                          <input type="text" value={branding.primary_color} onChange={e => setBranding({ ...branding, primary_color: e.target.value })} placeholder="#163A63" className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-slate-300" />
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {['#163A63','#2F8F5B','#7C3AED','#DC2626','#0891B2','#D97706','#0F172A','#BE185D'].map(c => (
                            <button key={c} type="button" onClick={() => setBranding({ ...branding, primary_color: c })} title={c}
                              style={{ background: c, width: 28, height: 28, borderRadius: 8, border: branding.primary_color === c ? '3px solid #fff' : '2px solid transparent', boxShadow: branding.primary_color === c ? `0 0 0 2px ${c}` : 'none' }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business type</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            { value: 'product', label: '📦 Products / Wholesale', desc: 'Physical goods, supply, retail' },
                            { value: 'service', label: '🔧 Services', desc: 'Trades, agencies, freelance' },
                            { value: 'consulting', label: '💼 Consulting', desc: 'Strategy, advice, coaching' },
                            { value: 'tech', label: '💻 Tech / SaaS', desc: 'Software, apps, digital' },
                            { value: 'food', label: '🍽️ Food & Beverage', desc: 'Catering, restaurant, drinks' },
                            { value: 'other', label: '✨ Other', desc: 'Any other business type' },
                          ].map(opt => (
                            <button key={opt.value} type="button" onClick={() => setBranding({ ...branding, business_type: opt.value as 'product' | 'service' })}
                              className={`p-3 rounded-xl border text-left transition-all ${branding.business_type === opt.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'}`}>
                              <div className="text-sm font-semibold">{opt.label}</div>
                              <div className={`text-xs mt-0.5 ${branding.business_type === opt.value ? 'text-slate-300' : 'text-slate-500'}`}>{opt.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Social media</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📸</span>
                            <input type="url" value={branding.instagram_url} onChange={e => setBranding({ ...branding, instagram_url: e.target.value })} placeholder="Instagram URL" className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">👥</span>
                            <input type="url" value={branding.facebook_url} onChange={e => setBranding({ ...branding, facebook_url: e.target.value })} placeholder="Facebook URL" className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <button onClick={saveBranding} disabled={!permissions.edit_branding} className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors">
                      {settingsSaved ? '✓ Saved!' : 'Save Branding'}
                    </button>
                  </div>
                  {/* Live colour preview */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <h4 className="font-semibold text-slate-800 mb-3">Colour Preview</h4>
                    <div className="rounded-xl overflow-hidden border border-slate-200" style={{ background: `linear-gradient(135deg, ${branding.primary_color || '#163A63'} 0%, #0f172a 100%)` }}>
                      <div className="p-6">
                        <div className="text-2xl font-black text-white mb-2">{branding.company_name || 'Your Company'}</div>
                        <p className="text-white/70 text-sm mb-4">This is how your website hero will look.</p>
                        <div className="inline-flex items-center gap-2 bg-white text-sm font-bold px-4 py-2 rounded-full" style={{ color: branding.primary_color || '#163A63' }}>Get Started →</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {websiteSubTab === 'contact' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                  <h3 className="font-bold text-slate-800">Contact settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={branding.phone} onChange={e => setBranding({ ...branding, phone: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">WhatsApp</label><input type="text" value={branding.whatsapp} onChange={e => setBranding({ ...branding, whatsapp: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">Sales email</label><input type="email" value={branding.sales_email} onChange={e => setBranding({ ...branding, sales_email: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="block text-sm font-medium mb-1">Support email</label><input type="email" value={branding.support_email} onChange={e => setBranding({ ...branding, support_email: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={branding.address} onChange={e => setBranding({ ...branding, address: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                  </div>
                  <button onClick={saveBranding} disabled={!permissions.edit_branding} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium disabled:opacity-50">{settingsSaved ? 'Saved' : 'Save Contact'}</button>
                </div>
              )}
              {websiteSubTab === 'cms' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Website Content</h3>
                    <p className="text-sm text-slate-500 mb-5">Pick a template to instantly fill your website with professional content, then customise it.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
                      {(Object.entries(WEBSITE_TEMPLATES) as [keyof typeof WEBSITE_TEMPLATES, typeof WEBSITE_TEMPLATES[keyof typeof WEBSITE_TEMPLATES]][]).map(([key, tpl]) => (
                        <button key={key} type="button" onClick={() => applyTemplate(key)}
                          className="relative group flex flex-col items-start p-4 rounded-xl border-2 transition-all text-left hover:shadow-md"
                          style={{ borderColor: websiteCms.hero_title === tpl.hero_title ? tpl.color : '#e2e8f0', background: websiteCms.hero_title === tpl.hero_title ? `${tpl.color}10` : '#f8fafc' }}>
                          <div className="w-full h-20 rounded-lg mb-3 flex items-center justify-center text-3xl font-black text-white" style={{ background: `linear-gradient(135deg, ${tpl.color} 0%, #0f172a 100%)` }}>
                            {tpl.emoji}
                          </div>
                          <div className="text-xs font-bold text-slate-800 leading-tight">{tpl.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{tpl.hero_title}</div>
                          {websiteCms.hero_title === tpl.hero_title && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ background: tpl.color }}>✓</div>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">Click any template to apply it, then customise the text below.</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">Or use AI to generate copy.</p>
                    <div className="flex gap-2">
                      <button onClick={() => generateAICopy('hero')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 disabled:opacity-50 flex items-center gap-1.5">
                        {aiGenerateLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Generate hero
                      </button>
                      <button onClick={() => generateAICopy('tagline')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50">AI tagline</button>
                      <button onClick={() => generateAICopy('about')} disabled={aiGenerateLoading} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-sm hover:bg-slate-50 disabled:opacity-50">AI about</button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border-l-2 border-slate-200 pl-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Top section</p>
                      <div className="space-y-3">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Headline</label><input type="text" value={websiteCms.hero_title} onChange={e => setWebsiteCms({ ...websiteCms, hero_title: e.target.value })} placeholder="e.g. Grow your business" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Subheadline</label><textarea value={websiteCms.hero_subtitle} onChange={e => setWebsiteCms({ ...websiteCms, hero_subtitle: e.target.value })} placeholder="Supporting line under the headline" rows={2} className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label><input type="text" value={websiteCms.value_line} onChange={e => setWebsiteCms({ ...websiteCms, value_line: e.target.value })} placeholder="Short catchphrase (optional)" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                      </div>
                    </div>
                    <div className="border-l-2 border-slate-200 pl-4">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-2">About & contact</p>
                      <div className="space-y-3">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">About section title</label><input type="text" value={websiteCms.about_title} onChange={e => setWebsiteCms({ ...websiteCms, about_title: e.target.value })} placeholder="e.g. About us" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Contact form heading</label><input type="text" value={websiteCms.stock_quote_title} onChange={e => setWebsiteCms({ ...websiteCms, stock_quote_title: e.target.value })} placeholder="e.g. Get in touch" className="w-full p-3 border border-slate-200 rounded-lg text-sm" /></div>
                      </div>
                    </div>
                  </div>
                  <button onClick={saveWebsiteCms} disabled={!permissions.edit_branding} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{settingsSaved ? 'Saved' : 'Save changes'}</button>
                </div>
              )}
              {websiteSubTab === 'visual' && (
                <div>
                  <h3 className="font-bold text-slate-800 mb-4">Visual builder</h3>
                  <VisualBuilder primaryColor={branding.primary_color || '#163A63'} orgId={org?.id} />
                </div>
              )}
            </div>
          )}
          {tab === 'crm' && (
            <div className="w-full max-w-6xl">
              <div className="mb-4 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-4 py-2 border border-slate-200 w-fit">
                <Globe size={14} /><span>Website</span><ArrowRight size={12} /><span>Leads land here</span><ArrowRight size={12} /><span className="font-medium text-slate-700">CRM</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">CRM</h2>
                  <p className="text-sm text-slate-600">Leads from your website and other sources. Move through pipeline, follow up.</p>
                </div>
                <button onClick={() => setAddLeadModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 shrink-0 shadow-sm">
                  <Plus size={16} /> Add lead
                </button>
              </div>
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm min-w-[120px]">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</p>
                  <p className="text-2xl font-bold text-slate-900 mt-0.5">{leads.length}</p>
                </div>
                {pipelineStages.slice(0, 5).map(s => (
                  <div key={s} className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm min-w-[100px]">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide truncate">{s}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-0.5">{leads.filter(l => (l.stage || 'NEW') === s).length}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <select value={crmViewType} onChange={e => setCrmViewType(e.target.value as CrmViewType)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white font-medium">
                  <option value="consulting">Consulting</option>
                  <option value="deals">Deals</option>
                  <option value="product">Product</option>
                  <option value="services">Services</option>
                </select>
                <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                  <button onClick={() => setCrmSubTab('pipeline')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${crmSubTab === 'pipeline' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Pipeline</button>
                  <button onClick={() => setCrmSubTab('contacts')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${crmSubTab === 'contacts' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Contacts</button>
                </div>
                <input type="text" value={crmSearch} onChange={e => setCrmSearch(e.target.value)} placeholder="Search leads..." className="px-3 py-2 rounded-lg border border-slate-200 text-sm w-44 focus:ring-2 focus:ring-slate-300 focus:border-slate-300" />
                <select value={crmSourceFilter} onChange={e => setCrmSourceFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white">
                  {sourceOptions.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All sources' : s}</option>)}
                </select>
              </div>
              {crmViewType === 'product' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-semibold text-slate-800">Product orders</h3>
                    <p className="text-sm text-slate-500">Orders from your store or catalog</p>
                  </div>
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No orders yet. Orders appear when customers purchase from your site or catalog.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left px-4 py-3 font-semibold text-slate-700">Order</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Total</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Date</th></tr></thead>
                        <tbody>
                          {orders.slice(0, 20).map(o => (
                            <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                              <td className="px-4 py-3 font-medium">${o.total.toFixed(2)}</td>
                              <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{o.status}</span></td>
                              <td className="px-4 py-3 text-slate-600">{o.created_at ? new Date(o.created_at).toLocaleDateString() : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : crmViewType === 'services' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">Service projects</h3>
                      <p className="text-sm text-slate-500">Projects from won leads or add manually</p>
                    </div>
                    <button onClick={() => setAddProjectModal(true)} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">
                      <Plus size={16} /> Add project
                    </button>
                  </div>
                  {serviceProjects.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">No projects yet. Move a consulting lead to Won or Contract Signed to auto-create a project.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className="border-b border-slate-200 bg-slate-50"><th className="text-left px-4 py-3 font-semibold text-slate-700">Project</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Credits</th><th className="text-left px-4 py-3 font-semibold text-slate-700">Status</th></tr></thead>
                        <tbody>
                          {serviceProjects.slice(0, 20).map(p => (
                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                              <td className="px-4 py-3 font-medium">{p.name}</td>
                              <td className="px-4 py-3">{p.credits_total}h</td>
                              <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-xs ${p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : p.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 'bg-amber-100 text-amber-800'}`}>{p.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : leads.length === 0 ? (
                <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500">No leads yet. Share your site, run Facebook ads to your site, or add a lead manually.</div>
              ) : crmSubTab === 'contacts' ? (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Name</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Company</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Email</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Stage</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Source</th>
                          <th className="text-left px-4 py-3 font-semibold text-slate-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {crmFilteredLeads.map(l => (
                          <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3"><button onClick={() => { setSelectedLead(l); setLeadNextAction(l.next_action || ''); }} className="font-medium text-slate-900 hover:underline">{l.name}</button></td>
                            <td className="px-4 py-3 text-slate-600">{l.company || '-'}</td>
                            <td className="px-4 py-3"><a href={`mailto:${l.email}`} className="text-blue-600 hover:underline">{l.email}</a></td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">{l.stage || 'NEW'}</span></td>
                            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs">{l.source || '-'}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {l.email && <a href={`mailto:${l.email}`} className="p-1.5 rounded hover:bg-blue-100 text-blue-600" title="Email"><Mail size={14} /></a>}
                                {l.phone && <a href={`tel:${l.phone}`} className="p-1.5 rounded hover:bg-slate-200" title="Call"><Phone size={14} /></a>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <KanbanPipeline
                  pipelineStages={pipelineStages}
                  leadsByStage={leadsByStage}
                  stageForLead={stageForLead}
                  updateLeadStage={updateLeadStage}
                  setSelectedLead={setSelectedLead}
                  setLeadNextAction={setLeadNextAction}
                />
              )}
              {addProjectModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setAddProjectModal(false)}>
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-slate-800 mb-4">Add project</h3>
                    <div className="space-y-3">
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Project name</label><input type="text" placeholder="e.g. Strategy workshop - Acme" value={addProjectForm.name} onChange={e => setAddProjectForm({ ...addProjectForm, name: e.target.value })} className="w-full p-2 border rounded text-sm" /></div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Credits / hours</label><input type="number" min={0} placeholder="e.g. 20" value={addProjectForm.credits || ''} onChange={e => setAddProjectForm({ ...addProjectForm, credits: Number(e.target.value) || 0 })} className="w-full p-2 border rounded text-sm" /></div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={async () => { if (!supabase || !org || !addProjectForm.name.trim()) return; await supabase.from('service_projects').insert({ org_id: org.id, name: addProjectForm.name.trim(), credits_total: addProjectForm.credits || 0, status: 'ACTIVE' }); const { data } = await supabase.from('service_projects').select('id, name, status, credits_total, lead_id').eq('org_id', org.id).order('created_at', { ascending: false }).limit(100); setServiceProjects((data || []).map((p: Record<string, unknown>) => ({ id: String(p.id), name: String(p.name || 'Project'), status: String(p.status || 'ACTIVE'), credits_total: Number(p.credits_total || 0), lead_id: p.lead_id ? String(p.lead_id) : undefined }))); setAddProjectModal(false); setAddProjectForm({ name: '', credits: 0 }); }} disabled={!addProjectForm.name.trim()} className="px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-emerald-700">Add</button>
                      <button onClick={() => { setAddProjectModal(false); setAddProjectForm({ name: '', credits: 0 }); }} className="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {addLeadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setAddLeadModal(false)}>
                  <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="font-bold text-slate-800 mb-4">Add lead</h3>
                    <div className="space-y-3">
                      <input type="text" placeholder="Name *" value={addLeadForm.name} onChange={e => setAddLeadForm({ ...addLeadForm, name: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="text" placeholder="Company" value={addLeadForm.company} onChange={e => setAddLeadForm({ ...addLeadForm, company: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="email" placeholder="Email *" value={addLeadForm.email} onChange={e => setAddLeadForm({ ...addLeadForm, email: e.target.value })} className="w-full p-2 border rounded text-sm" />
                      <input type="tel" placeholder="Phone" value={addLeadForm.phone} onChange={e => setAddLeadForm({ ...addLeadForm, phone: e.target.value })} className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={addLead} disabled={!addLeadForm.name.trim() || !addLeadForm.email.trim()} className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium disabled:opacity-50">Add</button>
                      <button onClick={() => setAddLeadModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded text-sm">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
              {selectedLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setSelectedLead(null)}>
                  <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-slate-800 text-lg">{selectedLead.name}</h3>
                      <button onClick={() => setSelectedLead(null)} className="p-1 rounded hover:bg-slate-100"><X size={18} /></button>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p><span className="text-slate-500">Company</span> {selectedLead.company || '-'}</p>
                      <p><span className="text-slate-500">Email</span> <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a></p>
                      <p><span className="text-slate-500">Phone</span> {selectedLead.phone ? <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a> : '-'}</p>
                      <p><span className="text-slate-500">Stage</span> {selectedLead.stage} · Source: {selectedLead.source || '-'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedLead.email && <a href={`mailto:${selectedLead.email}`} className="px-3 py-2 rounded-lg bg-blue-100 text-blue-700 flex items-center gap-2 text-sm font-medium hover:bg-blue-200"><Mail size={16} /> Email</a>}
                      {selectedLead.phone && <a href={`tel:${selectedLead.phone}`} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-2 text-sm font-medium hover:bg-slate-200"><Phone size={16} /> Call</a>}
                      {selectedLead.phone && <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg bg-green-100 text-green-700 flex items-center gap-2 text-sm font-medium hover:bg-green-200"><MessageCircle size={16} /> WhatsApp</a>}
                      <button onClick={createQuoteFromLead} className="px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 flex items-center gap-2 text-sm font-medium hover:bg-emerald-200">Create quote</button>
                    </div>
                    <div className="mt-6">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Next action</label>
                      <div className="flex gap-2">
                        <input type="text" value={leadNextAction} onChange={e => setLeadNextAction(e.target.value)} placeholder="e.g. Follow up tomorrow" className="flex-1 p-2 border rounded text-sm" />
                        <button onClick={() => updateLeadNextAction(selectedLead.id, leadNextAction)} className="px-3 py-2 bg-slate-800 text-white rounded text-sm font-medium">Save</button>
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Add note</label>
                      <div className="flex gap-2">
                        <input type="text" value={leadNote} onChange={e => setLeadNote(e.target.value)} placeholder="Log a note..." className="flex-1 p-2 border rounded text-sm" onKeyDown={e => e.key === 'Enter' && addLeadNote()} />
                        <button onClick={addLeadNote} disabled={!leadNote.trim()} className="px-3 py-2 bg-slate-800 text-white rounded text-sm font-medium disabled:opacity-50">Add</button>
                      </div>
                    </div>
                    {leadNotes.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-xs font-medium text-slate-500 uppercase mb-2">Contact 360 - Activity timeline</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {leadNotes.map((n, i) => (
                            <div key={i} className="p-2 bg-slate-50 rounded text-sm">
                              <p className="text-slate-800">{n.note}</p>
                              <p className="text-xs text-slate-400 mt-1">{n.performedBy} · {new Date(n.createdAt).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === 'marketing' && (
            <div className="max-w-2xl space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Marketing</h2>
                <p className="text-sm text-slate-500">Get leads and send emails. Run Facebook ads, point them to your site, and leads drop into CRM.</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Quick Email Templates</h3>
                <p className="text-sm text-slate-600 mb-4">Click a template to auto-fill the email composer below. Works great for follow-ups and stage-based outreach.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: '👋 New lead intro', subject: 'Thank you for reaching out, {name}!', body: `Hi {name},\n\nThank you for getting in touch with us. We received your enquiry and will follow up within 1-2 business days.\n\nIn the meantime, feel free to reply to this email if you have any questions.\n\nBest regards,\n${org?.name || 'Our Team'}` },
                    { label: '📋 Proposal follow-up', subject: 'Following up on your proposal, {name}', body: `Hi {name},\n\nI wanted to follow up on the proposal we sent over. I hope you've had a chance to review it.\n\nAre there any questions I can answer or adjustments you'd like to discuss? I'm happy to jump on a quick call.\n\nLooking forward to hearing from you.\n\nBest regards,\n${org?.name || 'Our Team'}` },
                    { label: '🔁 Re-engagement', subject: 'Checking in - any update, {name}?', body: `Hi {name},\n\nI hope you're doing well! I'm following up to see if you'd still like to move forward, or if your priorities have changed.\n\nNo pressure at all. Just want to make sure I'm not missing anything on our end.\n\nLet me know if now is a good time to connect.\n\nBest regards,\n${org?.name || 'Our Team'}` },
                    { label: '🎉 Deal won / welcome', subject: 'Welcome aboard, {name}! 🎉', body: `Hi {name},\n\nWe're thrilled to welcome you as a client! Everything is now set up on our end.\n\nWe'll be in touch shortly with next steps. In the meantime, please don't hesitate to reach out with any questions.\n\nLooking forward to working together!\n\nBest regards,\n${org?.name || 'Our Team'}` },
                    { label: '📞 Book a call', subject: 'Let\'s find time to chat, {name}', body: `Hi {name},\n\nI'd love to schedule a quick call to better understand your needs and see how we can help.\n\nDoes 15–20 minutes this week or next work for you? Feel free to suggest a time, or book directly here: [your calendar link]\n\nLooking forward to connecting!\n\nBest regards,\n${org?.name || 'Our Team'}` },
                    { label: '🛒 Abandoned quote', subject: 'Your quote is ready - {name}', body: `Hi {name},\n\nJust a quick note. Your quote is ready and waiting! We'd hate for you to miss out.\n\nIf you have any questions or would like to adjust anything, just reply and I'll take care of it right away.\n\nBest regards,\n${org?.name || 'Our Team'}` },
                  ].map((tpl) => (
                    <button key={tpl.label} type="button" onClick={() => setMarketingCompose({ subject: tpl.subject, body: tpl.body, recipientIds: [] })} className="text-left p-3 rounded-lg border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 text-sm transition-colors">
                      <div className="font-medium text-slate-800">{tpl.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">{tpl.subject}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-2">Stage-based targeting</h3>
                <p className="text-sm text-slate-600 mb-3">Select leads by pipeline stage to send targeted emails. Useful for sending follow-ups only to leads in Proposal or Negotiation.</p>
                <div className="flex flex-wrap gap-2">
                  {['NEW', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'DISCOVERY', 'STRATEGY_SESSION', 'CONTRACT_SIGNED'].map(stage => {
                    const stageLeads = leads.filter(l => l.stage === stage);
                    if (stageLeads.length === 0) return null;
                    return (
                      <button key={stage} type="button" onClick={() => setMarketingCompose(prev => ({ ...prev, recipientIds: stageLeads.map(l => l.id) }))} className="px-3 py-1.5 text-xs rounded-full border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300 font-medium text-slate-700">
                        {stage.replace(/_/g, ' ')} ({stageLeads.length})
                      </button>
                    );
                  })}
                  {leads.length === 0 && <p className="text-sm text-slate-500">No leads yet. Add leads from the CRM tab first.</p>}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-3">Lead sources</h3>
                <p className="text-sm text-slate-600 mb-4">Leads land in CRM from these sources:</p>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">1. Your website</p>
                    <p className="text-slate-600 text-sm mt-1">Your contact form captures leads. Run Facebook or Google ads to your site URL - leads land in CRM.</p>
                    {org && (
                      <div className="mt-2 flex gap-2">
                        <code className="flex-1 p-2 bg-white rounded border border-slate-200 text-xs font-mono break-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/site/${org.id}` : `/site/${org.id}`}
                        </code>
                        <button type="button" onClick={() => { const u = typeof window !== 'undefined' ? `${window.location.origin}/site/${org.id}` : ''; navigator.clipboard?.writeText(u); }} className="shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium hover:bg-slate-50">Copy</button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">2. Webhook for Zapier / Facebook Lead Ads</p>
                    <p className="text-slate-600 text-sm mt-1">Connect Facebook Lead Ads or any tool via webhook - POST leads to this URL:</p>
                    <div className="mt-2 flex gap-2">
                      <code className="flex-1 p-2 bg-white rounded border border-slate-200 text-xs font-mono break-all">
                        {typeof window !== 'undefined' ? `${window.location.origin}/api/submit-contact` : '/api/submit-contact'}
                      </code>
                      <button type="button" onClick={() => { const u = typeof window !== 'undefined' ? `${window.location.origin}/api/submit-contact` : ''; navigator.clipboard?.writeText(u); }} className="shrink-0 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium hover:bg-slate-50">Copy</button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">JSON body: org_id, name, email, type:&quot;QUOTE&quot;, source:&quot;FACEBOOK&quot;, message, phone, company</p>
                    {org && <p className="text-xs text-slate-500 mt-1">Your org_id: <code className="bg-white px-1 rounded border">{org.id}</code> <button type="button" onClick={() => navigator.clipboard?.writeText(org.id)} className="text-blue-600 hover:underline ml-1">Copy</button></p>}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-800 text-sm">3. Manual add</p>
                    <p className="text-slate-600 text-sm mt-1">Add leads from CRM → Add lead.</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <h3 className="font-semibold text-slate-800">Send email</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
                  <p className="text-xs text-slate-500 mb-2">Choose who receives this email. Leave all unchecked to send to everyone; or select one or more leads.</p>
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setMarketingCompose({ ...marketingCompose, recipientIds: leads.map(l => l.id) })} className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Select all</button>
                    <button type="button" onClick={() => setMarketingCompose({ ...marketingCompose, recipientIds: [] })} className="text-xs px-2 py-1 rounded border border-slate-200 hover:bg-slate-50">Select none</button>
                  </div>
                  <div className="max-h-32 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1">
                    {leads.map(l => (
                      <label key={l.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                        <input type="checkbox" checked={marketingCompose.recipientIds.length === 0 || marketingCompose.recipientIds.includes(l.id)} onChange={e => {
                          if (marketingCompose.recipientIds.length === 0) setMarketingCompose({ ...marketingCompose, recipientIds: leads.filter(x => x.id !== l.id).map(x => x.id) });
                          else if (e.target.checked) setMarketingCompose({ ...marketingCompose, recipientIds: [...marketingCompose.recipientIds, l.id] });
                          else setMarketingCompose({ ...marketingCompose, recipientIds: marketingCompose.recipientIds.filter(id => id !== l.id) });
                        }} />
                        <span className="text-sm truncate">{l.name} {l.company ? `· ${l.company}` : ''}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{marketingCompose.recipientIds.length === 0 ? `Will send to all ${leads.length} leads` : `Sending to ${marketingCompose.recipientIds.length} selected`}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input type="text" value={marketingCompose.subject} onChange={e => setMarketingCompose({ ...marketingCompose, subject: e.target.value })} placeholder="Your email subject" className="w-full p-3 border border-slate-200 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Body</label>
                  <textarea value={marketingCompose.body} onChange={e => setMarketingCompose({ ...marketingCompose, body: e.target.value })} placeholder={`Hi {name},\n\n...\n\nBest regards`} rows={6} className="w-full p-3 border border-slate-200 rounded-lg text-sm resize-none" />
                  <p className="text-xs text-slate-500 mt-1">Use {"{name}"} for first name, {"{company}"} for company.</p>
                </div>
                {marketingSentCount > 0 && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800 font-medium flex items-center gap-2">
                    <span>✅</span> Sent to {marketingSentCount} recipient{marketingSentCount !== 1 ? 's' : ''}!
                  </div>
                )}
                <button onClick={sendBulkEmail} disabled={marketingSending || leads.length === 0 || !marketingCompose.subject.trim() || !marketingCompose.body.trim()} className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {marketingSending ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                  {marketingSending ? 'Sending...' : `Send to ${marketingCompose.recipientIds.length > 0 ? marketingCompose.recipientIds.length : leads.length} recipient${(marketingCompose.recipientIds.length || leads.length) === 1 ? '' : 's'}`}
                </button>
              </div>
            </div>
          )}
          {tab === 'support' && (
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Support Tickets</h2>
                  <p className="text-sm text-slate-500">Tickets from your website, leads, and customer portal. Assign, reply, resolve.</p>
                </div>
                <select value={supportFilter} onChange={e => setSupportFilter(e.target.value as typeof supportFilter)} className="p-2 border border-slate-200 rounded-lg text-sm">
                  <option value="ALL">All tickets</option>
                  <option value="ESCALATIONS">From website / leads</option>
                  <option value="OPEN">Open</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">Open: {tickets.filter(t => t.status === 'OPEN').length}</span>
                <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">In progress: {tickets.filter(t => t.status === 'IN_PROGRESS').length}</span>
                <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800">Resolved: {tickets.filter(t => t.status === 'RESOLVED').length}</span>
              </div>
              {escalationTickets.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-amber-900">Escalation Queue</h3>
                    <span className="text-xs text-amber-700">Open: {escalationTickets.filter(t => t.status !== 'RESOLVED').length} · Unassigned: {escalationTickets.filter(t => !(t.assignee || '').trim()).length}</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {escalationTickets.slice(0, 6).map(t => (
                      <div key={t.id} className="bg-white border border-amber-200 rounded-lg p-3 flex justify-between items-center gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{t.subject}</p>
                          <p className="text-xs text-slate-500">{t.assignee || 'Unassigned'} · {new Date(t.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-100 text-red-700 font-bold">{t.priority}</span>
                          <button onClick={() => updateTicketStatus(t.id, 'IN_PROGRESS')} className="px-2 py-1 rounded bg-amber-600 text-white text-xs hover:bg-amber-700">Start</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button onClick={() => setSupportNewTicketOpen(!supportNewTicketOpen)} className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-50">
                  <span className="font-semibold text-slate-800">{supportNewTicketOpen ? 'Close' : 'New ticket'}</span>
                  <Plus size={18} className={supportNewTicketOpen ? 'rotate-45' : ''} />
                </button>
                {supportNewTicketOpen && (
                  <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mt-4">
                      <input value={ticketForm.subject} onChange={e => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Subject" className="p-2 border border-slate-200 rounded-lg text-sm" />
                      <input value={ticketForm.customer} onChange={e => setTicketForm({ ...ticketForm, customer: e.target.value })} placeholder="Customer / company" className="p-2 border border-slate-200 rounded-lg text-sm" />
                      <select value={ticketForm.priority} onChange={e => setTicketForm({ ...ticketForm, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>
                      <select value={ticketForm.assignee} onChange={e => setTicketForm({ ...ticketForm, assignee: e.target.value })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="">Assign to</option>
                        {members.map(m => (<option key={m.id} value={m.name}>{m.name}</option>))}
                      </select>
                      <select value={ticketForm.source} onChange={e => setTicketForm({ ...ticketForm, source: e.target.value as typeof ticketForm.source })} className="p-2 border border-slate-200 rounded-lg text-sm">
                        <option value="MANUAL">MANUAL</option>
                        <option value="LEAD_ESCALATION">LEAD_ESCALATION</option>
                        <option value="CUSTOMER_PORTAL">CUSTOMER_PORTAL</option>
                        <option value="WEBSITE">WEBSITE</option>
                      </select>
                      <button onClick={async () => { await addTicket(); setSupportNewTicketOpen(false); }} disabled={!ticketForm.subject.trim() || !ticketForm.customer.trim()} className="bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 py-2">Create</button>
                    </div>
                  </div>
                )}
              </div>
              {visibleTickets.length === 0 ? (
                <div className="p-8 bg-white rounded-xl border border-slate-200 text-center text-slate-500">
                  {tickets.length === 0 ? 'No tickets yet. Create one or wait for submissions from your website / contact form.' : 'No tickets match this filter.'}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {visibleTickets.map(t => (
                    <div key={t.id} className="border-b border-slate-100 last:border-b-0">
                      <div
                        onClick={() => setExpandedTicketId(expandedTicketId === t.id ? null : t.id)}
                        className="p-4 flex justify-between items-start gap-4 hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900">{t.subject}</h4>
                          <p className="text-xs text-slate-500">{t.customer}{t.contact_email ? ` · ${t.contact_email}` : ''} · {new Date(t.created_at).toLocaleDateString()} · {t.source || 'MANUAL'} · {t.assignee || 'Unassigned'}</p>
                          {t.message && <p className={`text-sm text-slate-600 mt-2 whitespace-pre-wrap ${expandedTicketId === t.id ? '' : 'line-clamp-2'}`}>{t.message}</p>}
                        </div>
                        <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${t.priority === 'HIGH' ? 'bg-red-100 text-red-700' : t.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{t.priority}</span>
                          <select value={t.assignee || ''} onChange={e => updateTicketAssignee(t.id, e.target.value)} className="p-1.5 border border-slate-200 rounded text-xs">
                            <option value="">Unassigned</option>
                            {members.map(m => (<option key={m.id} value={m.name}>{m.name}</option>))}
                          </select>
                          <select value={t.status} onChange={e => updateTicketStatus(t.id, e.target.value)} className="p-1.5 border border-slate-200 rounded text-xs">
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                          {(() => { const email = t.contact_email || leads.find(l => l.name === t.customer || l.company === t.customer)?.email; return email ? <a href={`mailto:${email}?subject=Re:%20${encodeURIComponent(t.subject)}`} className="p-1.5 rounded hover:bg-slate-100 text-slate-600" title="Reply via email"><Mail size={16} /></a> : null; })()}
                          <button onClick={() => deleteTicket(t.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      {expandedTicketId === t.id && t.message && (
                        <div className="px-4 pb-4 pt-0">
                          <div className="pl-0 text-sm text-slate-600 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 border border-slate-100">{t.message}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'team' && (
            <div className="max-w-2xl">
              <p className="text-slate-600 mb-4">Invite team members and manage access. Only admins can invite; you choose each person&apos;s role (e.g. Sales, Finance, Marketing) to control what they can see.</p>
              {permissions.invite_team && (
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div className="min-w-[180px]">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Role (access level)</label>
                      <select
                        value={inviteRole}
                        onChange={(e) => setInviteRole(e.target.value as typeof inviteRole)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      >
                        {INVITEABLE_ROLES.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleInvite}
                      disabled={inviteLoading || !inviteEmail.trim()}
                      className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                      Invite
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    {INVITEABLE_ROLES.find((r) => r.value === inviteRole)?.desc}. Pick the role that matches what they should access.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              {permissions.edit_branding ? (
                <>
                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-1">Organization</h3>
                    <p className="text-xs text-slate-500 mb-4">Basic info about your organization.</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Organization name</label>
                        <input type="text" value={org?.name || ''} onChange={async (e) => { const n = e.target.value; if (org && n.trim()) { await supabase?.from('organizations').update({ name: n.trim() }).eq('id', org.id); setOrg(o => o ? { ...o, name: n.trim() } : o); } }} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Your company name" />
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Organization ID</p>
                          <p className="text-sm font-mono text-slate-700 mt-0.5">{org?.id}</p>
                        </div>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(org?.id || '')} className="ml-auto text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded border border-slate-200 bg-white">Copy</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-1">Website & Domain</h3>
                    <p className="text-sm text-slate-500 mb-4">Your business website is live at the URL below. Share it anywhere.</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-sm text-slate-700 break-all">
                          {typeof window !== 'undefined' ? `${window.location.origin}/site/${org?.id}` : `/site/${org?.id}`}
                        </div>
                        <button type="button" onClick={() => navigator.clipboard?.writeText(typeof window !== 'undefined' ? `${window.location.origin}/site/${org?.id}` : '')} className="px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm hover:bg-slate-50 shrink-0">Copy</button>
                        <a href={`/site/${org?.id}`} target="_blank" rel="noopener noreferrer" className="px-3 py-3 rounded-xl bg-slate-900 text-white text-sm hover:bg-slate-800 shrink-0 flex items-center gap-1.5">
                          <ExternalLink size={14} /> View
                        </a>
                      </div>
                      <p className="text-xs text-slate-500">Custom domain support coming soon. For now, share this URL or set it as a redirect from your own domain.</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-1">Notification Email</h3>
                    <p className="text-sm text-slate-500 mb-4">When someone submits your contact form, where should we send the lead notification?</p>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Notification email</label>
                      <input type="email" value={branding.contact_email} onChange={e => setBranding({ ...branding, contact_email: e.target.value })} placeholder="you@company.com" className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" />
                      <p className="text-xs text-slate-500 mt-1.5">This is your private ops email. Customers never see it.</p>
                    </div>
                    <button onClick={saveBranding} disabled={!permissions.edit_branding} className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50">
                      {settingsSaved ? '✓ Saved!' : 'Save'}
                    </button>
                  </div>

                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Shield size={18} /> Account Security
                    </h3>
                    <p className="text-sm text-slate-600 mb-1">Signed in as: <span className="font-medium">{user?.email}</span></p>
                    <p className="text-sm text-slate-600 mb-4">Enable Two-Factor Authentication (2FA) for extra account security.</p>
                    <a href="https://supabase.com/docs/guides/auth/auth-mfa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
                      <Shield size={16} /> Enable 2FA
                    </a>
                  </div>

                  {/* Connections & Integrations */}
                  <div className="p-6 bg-white rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">🔌 Connections & Integrations</h3>
                    <p className="text-sm text-slate-500 mb-5">Connect your marketing tools so leads from ads and social flow straight into your pipeline.</p>

                    {/* Facebook Pixel */}
                    <div className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">📘</span>
                        <p className="font-semibold text-sm text-slate-800">Facebook / Meta Pixel</p>
                        {branding.facebook_pixel_id ? <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Connected</span> : <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full">Not connected</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Paste your Pixel ID and it will be automatically added to your website. Tracks visitors from your Facebook/Instagram ads.</p>
                      <input type="text" value={branding.facebook_pixel_id} onChange={e => setBranding({ ...branding, facebook_pixel_id: e.target.value })} placeholder="e.g. 1234567890123456" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white" />
                    </div>

                    {/* Google Analytics */}
                    <div className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🔍</span>
                        <p className="font-semibold text-sm text-slate-800">Google Analytics 4</p>
                        {branding.ga_id ? <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Connected</span> : <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full">Not connected</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Track website traffic and visitor behaviour. Paste your GA4 Measurement ID (starts with G-).</p>
                      <input type="text" value={branding.ga_id} onChange={e => setBranding({ ...branding, ga_id: e.target.value })} placeholder="e.g. G-XXXXXXXXXX" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white" />
                    </div>

                    {/* Auto welcome email */}
                    <div className="mb-5 p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✉️</span>
                          <p className="font-semibold text-sm text-slate-800">Auto Welcome Email</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBranding(b => ({ ...b, auto_welcome_email: !b.auto_welcome_email }))}
                          className={`relative w-10 h-5 rounded-full transition-colors ${branding.auto_welcome_email ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${branding.auto_welcome_email ? 'translate-x-5' : ''}`} />
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">When someone fills your contact form, automatically send them a welcome email so they know you received their enquiry.</p>
                    </div>

                    {/* Custom domain */}
                    <div className="mb-5 p-4 rounded-xl border border-blue-100 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🌐</span>
                        <p className="font-semibold text-sm text-slate-800">Custom Domain</p>
                        <span className="ml-auto text-[10px] bg-blue-200 text-blue-700 font-bold px-2 py-0.5 rounded-full">Coming soon</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Point your own domain (e.g. <span className="font-mono">yourcompany.com</span>) to your Stoklync website. In the meantime, set up a redirect from your domain registrar.</p>
                      <div className="text-xs bg-white rounded-lg p-3 border border-blue-200 font-mono text-slate-600">
                        Your current site URL:<br />
                        <span className="text-indigo-600 break-all">{typeof window !== 'undefined' ? `${window.location.origin}/site/${org?.id}` : `/site/${org?.id}`}</span>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💬</span>
                        <p className="font-semibold text-sm text-slate-800">WhatsApp Button</p>
                        {branding.whatsapp ? <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">Active</span> : <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full">Not set</span>}
                      </div>
                      <p className="text-xs text-slate-500 mb-2">Add your WhatsApp number and a floating chat button appears on your website so customers can reach you instantly.</p>
                      <input type="tel" value={branding.whatsapp} onChange={e => setBranding({ ...branding, whatsapp: e.target.value })} placeholder="+1 876 000 0000" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white" />
                    </div>

                    <button onClick={saveBranding} disabled={!permissions.edit_branding} className="mt-5 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2">
                      {settingsSaved ? '✓ Connections saved!' : 'Save connections'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 bg-white rounded-xl border border-slate-200">
                  <h3 className="font-bold text-slate-800 mb-2">Organization</h3>
                  <p className="text-slate-600">{org?.name}</p>
                  <p className="text-sm text-slate-500 mt-1">ID: {org?.id}</p>
                  <p className="text-sm text-slate-500 mt-4">Contact your admin to change settings.</p>
                </div>
              )}
            </div>
          )}
          {tab === 'billing' && (
            <div className="max-w-4xl space-y-8">
              {/* Current plan status */}
              <div className={`rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentPlan === 'free_trial' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : currentPlan === 'pro' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{currentPlan === 'free_trial' ? '⏳' : currentPlan === 'starter' ? '🌱' : currentPlan === 'business' ? '🚀' : '💎'}</span>
                    <p className="font-bold text-lg">{currentPlan === 'free_trial' ? 'Free Trial' : currentPlan === 'starter' ? 'Starter Plan' : currentPlan === 'business' ? 'Business Plan' : 'Pro Plan'}</p>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                      {currentPlan === 'free_trial' ? 'ACTIVE' : 'SUBSCRIBED'}
                    </span>
                  </div>
                  <p className="text-sm opacity-80">
                    {currentPlan === 'free_trial'
                      ? `${trialDaysLeft} days remaining in your free trial. No credit card required yet.`
                      : currentPlan === 'starter' ? 'Your Starter plan renews monthly. Upgrade anytime.'
                      : currentPlan === 'business' ? 'Your Business plan renews monthly. Full feature access.'
                      : 'You\'re on the Pro plan. Full access to everything.'}
                  </p>
                </div>
                {currentPlan === 'free_trial' && (
                  <button onClick={() => setCurrentPlan('business')} className="bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors shrink-0">
                    Upgrade now →
                  </button>
                )}
              </div>

              {/* Plans grid */}
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Choose your plan</h2>
                <p className="text-slate-500 text-sm mb-6">All plans include your live website, CRM, and email marketing. Cancel anytime.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      id: 'free_trial' as const,
                      name: 'Free Trial',
                      price: '$0',
                      period: '14 days',
                      emoji: '⏳',
                      color: 'border-amber-300',
                      badge: 'Try free',
                      badgeColor: 'bg-amber-100 text-amber-700',
                      features: ['1 website', '10 leads/month', 'Basic templates', 'Email marketing (50/mo)', 'CRM pipeline', 'Community support'],
                      cta: 'Current plan',
                      ctaDisabled: true,
                    },
                    {
                      id: 'starter' as const,
                      name: 'Starter',
                      price: '$19',
                      period: '/month',
                      emoji: '🌱',
                      color: 'border-slate-200',
                      badge: 'Popular',
                      badgeColor: 'bg-slate-100 text-slate-600',
                      features: ['1 website', '100 leads/month', 'All templates', 'Email marketing (500/mo)', 'CRM pipeline', 'Facebook Pixel', 'Google Analytics', 'Email support'],
                      cta: currentPlan === 'starter' ? '✓ Current plan' : 'Get Starter',
                      ctaDisabled: currentPlan === 'starter',
                    },
                    {
                      id: 'business' as const,
                      name: 'Business',
                      price: '$49',
                      period: '/month',
                      emoji: '🚀',
                      color: 'border-indigo-400 ring-2 ring-indigo-400',
                      badge: 'Most popular',
                      badgeColor: 'bg-indigo-100 text-indigo-700',
                      features: ['3 websites', 'Unlimited leads', 'All templates + Visual builder', 'Unlimited email marketing', 'Full CRM + Pipeline', 'All integrations', 'Auto welcome emails', 'Priority support', 'WhatsApp button'],
                      cta: currentPlan === 'business' ? '✓ Current plan' : 'Get Business',
                      ctaDisabled: currentPlan === 'business',
                    },
                    {
                      id: 'pro' as const,
                      name: 'Pro',
                      price: '$99',
                      period: '/month',
                      emoji: '💎',
                      color: 'border-purple-400',
                      badge: 'Agency ready',
                      badgeColor: 'bg-purple-100 text-purple-700',
                      features: ['Unlimited websites', 'Unlimited leads', 'White-label dashboard', 'Custom domain', 'API access', 'Team members (10)', 'Dedicated account manager', 'SLA support', 'Advanced analytics'],
                      cta: currentPlan === 'pro' ? '✓ Current plan' : 'Get Pro',
                      ctaDisabled: currentPlan === 'pro',
                    },
                  ].map(plan => (
                    <div key={plan.id} className={`bg-white rounded-2xl border-2 ${plan.color} p-5 flex flex-col relative`}>
                      {plan.id === 'business' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl">{plan.emoji}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.badgeColor}`}>{plan.badge}</span>
                      </div>
                      <p className="font-bold text-slate-900 text-lg">{plan.name}</p>
                      <div className="flex items-end gap-1 mt-1 mb-4">
                        <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                      </div>
                      <ul className="space-y-1.5 flex-1 mb-5">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-2 text-xs text-slate-600">
                            <span className="text-emerald-500 font-bold mt-0.5 shrink-0">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => { if (!plan.ctaDisabled) setCurrentPlan(plan.id); }}
                        disabled={plan.ctaDisabled}
                        className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                          plan.ctaDisabled
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : plan.id === 'business'
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {plan.cta}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><CreditCard size={16} /> Payment Method</h3>
                  <p className="text-sm text-slate-500 mb-4">No payment method on file yet. You&apos;ll be asked to add one when upgrading.</p>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800">Add payment method</button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-bold text-slate-800 mb-1">Billing History</h3>
                  <p className="text-sm text-slate-500 mb-4">No invoices yet. They&apos;ll appear here after your first payment.</p>
                  <div className="text-center py-4">
                    <span className="text-3xl">🧾</span>
                    <p className="text-xs text-slate-400 mt-1">No invoices</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4">Frequently asked questions</h3>
                <div className="space-y-4">
                  {[
                    { q: 'Can I cancel anytime?', a: 'Yes. Cancel anytime from this page with no penalties. Your website stays live until the end of your billing period.' },
                    { q: 'What happens after the free trial?', a: 'After 14 days you can choose a paid plan or stay on a limited free tier. Your data is never deleted.' },
                    { q: 'Do you offer refunds?', a: 'Yes. If you\'re not satisfied within the first 7 days of a paid plan, contact us for a full refund.' },
                    { q: 'Can I change plans later?', a: 'Absolutely. Upgrade or downgrade anytime. Prorated credits are applied automatically.' },
                  ].map(faq => (
                    <div key={faq.q} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-semibold text-slate-800 mb-1">{faq.q}</p>
                      <p className="text-sm text-slate-500">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cancel / danger */}
              {currentPlan !== 'free_trial' && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-red-800 mb-1">Cancel subscription</h3>
                  <p className="text-sm text-red-600 mb-3">Your website and data will remain accessible until the end of your current billing period.</p>
                  {showCancelConfirm ? (
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-red-700 font-medium">Are you sure?</p>
                      <button onClick={() => { setCurrentPlan('free_trial'); setShowCancelConfirm(false); }} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">Yes, cancel</button>
                      <button onClick={() => setShowCancelConfirm(false)} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50">Keep plan</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowCancelConfirm(true)} className="px-4 py-2 border border-red-300 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors">Cancel subscription</button>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'account' && (
            <div className="max-w-2xl space-y-6">
              {/* Profile */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><span>👤</span> Profile</h3>
                <p className="text-sm text-slate-500 mb-5">Your personal information. This is separate from your organisation branding.</p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {(profileForm.name || profileForm.email || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{profileForm.name || 'Your Name'}</p>
                    <p className="text-sm text-slate-500">{profileForm.email}</p>
                    <span className="inline-flex items-center mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                      {members.find(m => m.email === user?.email)?.role || 'Owner'}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full name</label>
                    <input type="text" value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))} className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
                    <input type="email" value={profileForm.email} readOnly className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (supabase && profileForm.name.trim()) {
                      await supabase.auth.updateUser({ data: { name: profileForm.name.trim() } });
                      if (org) await supabase.from('team_members').update({ name: profileForm.name.trim() }).eq('user_id', user?.id || '').eq('org_id', org.id);
                      setProfileSaved(true);
                      setTimeout(() => setProfileSaved(false), 2000);
                    }
                  }}
                  className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
                >
                  {profileSaved ? '✓ Saved!' : 'Save profile'}
                </button>
              </div>

              {/* Organisation */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><span>🏢</span> Organisation</h3>
                <p className="text-sm text-slate-500 mb-4">Your business workspace. All team members share this organisation.</p>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    {(org?.name || 'O')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900">{org?.name}</p>
                    <p className="text-xs text-slate-400 font-mono truncate">{org?.id}</p>
                  </div>
                  <button onClick={() => setTab('settings')} className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 shrink-0">Edit →</button>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  {[
                    { label: 'Team members', value: members.length },
                    { label: 'Total leads', value: leads.length },
                    { label: 'Active tickets', value: tickets.filter(t => t.status === 'OPEN').length },
                  ].map(s => (
                    <div key={s.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-xl font-bold text-slate-900">{s.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription summary */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><CreditCard size={16} /> Current Plan</h3>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currentPlan === 'free_trial' ? '⏳' : currentPlan === 'starter' ? '🌱' : currentPlan === 'business' ? '🚀' : '💎'}</span>
                    <div>
                      <p className="font-bold text-slate-900">{currentPlan === 'free_trial' ? 'Free Trial' : currentPlan === 'starter' ? 'Starter · $19/mo' : currentPlan === 'business' ? 'Business · $49/mo' : 'Pro · $99/mo'}</p>
                      <p className="text-xs text-slate-500">{currentPlan === 'free_trial' ? `${trialDaysLeft} days left` : 'Renews monthly'}</p>
                    </div>
                  </div>
                  <button onClick={() => setTab('billing')} className="text-xs text-indigo-600 font-semibold hover:text-indigo-800">Manage plan →</button>
                </div>
                {currentPlan === 'free_trial' && (
                  <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between gap-3">
                    <p className="text-xs text-amber-700 font-medium">Trial ends in {trialDaysLeft} days. Upgrade to keep everything.</p>
                    <button onClick={() => setTab('billing')} className="text-xs bg-amber-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors shrink-0">Upgrade →</button>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Shield size={16} /> Password & Security</h3>
                <p className="text-sm text-slate-500 mb-4">Change your password or set up two-factor authentication.</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={async () => {
                      if (supabase && user?.email) {
                        await supabase.auth.resetPasswordForEmail(user.email);
                        alert('Password reset email sent to ' + user.email);
                      }
                    }}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800"
                  >
                    Send password reset email
                  </button>
                  <a href="https://supabase.com/docs/guides/auth/auth-mfa" target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50">
                    Enable 2FA
                  </a>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><span>🔔</span> Notifications</h3>
                <p className="text-sm text-slate-500 mb-4">Choose what you&apos;re notified about.</p>
                <div className="space-y-3">
                  {[
                    { label: 'New lead from website', desc: 'Get notified when someone fills your contact form', key: 'notif_new_lead', default: true },
                    { label: 'Lead stage change', desc: 'When a lead moves to a new stage in your pipeline', key: 'notif_stage', default: false },
                    { label: 'New support ticket', desc: 'When a customer submits a support request', key: 'notif_ticket', default: true },
                    { label: 'Weekly summary', desc: 'Weekly digest of your pipeline, leads, and revenue', key: 'notif_weekly', default: true },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <div className={`relative w-10 h-5 rounded-full transition-colors ${n.default ? 'bg-emerald-500' : 'bg-slate-300'} cursor-pointer`}>
                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${n.default ? 'translate-x-5' : ''}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone — hidden behind a reveal */}
              <div className="border border-red-200 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowDangerZone(v => !v)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-red-50 hover:bg-red-100 transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <p className="font-bold text-red-800 text-sm">Danger Zone</p>
                    <span className="text-[10px] text-red-500 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full font-semibold">Irreversible actions</span>
                  </div>
                  <span className="text-red-400 text-xs font-semibold">{showDangerZone ? 'Hide ↑' : 'Show ↓'}</span>
                </button>
                {showDangerZone && (
                  <div className="bg-white p-6 space-y-5">
                    <p className="text-sm text-slate-500">To confirm any action below, type <span className="font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">DELETE</span> in the box first.</p>
                    <input
                      type="text"
                      value={dangerZoneConfirm}
                      onChange={e => setDangerZoneConfirm(e.target.value)}
                      placeholder="Type DELETE to unlock actions"
                      className="w-full p-3 border-2 border-red-200 rounded-xl text-sm focus:outline-none focus:border-red-400 font-mono"
                    />
                    <div className="space-y-3 opacity-0 transition-opacity" style={{ opacity: dangerZoneConfirm === 'DELETE' ? 1 : 0.3, pointerEvents: dangerZoneConfirm === 'DELETE' ? 'auto' : 'none' }}>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Delete all leads</p>
                          <p className="text-xs text-slate-500">Permanently removes all {leads.length} leads and pipeline data</p>
                        </div>
                        <button
                          className="text-xs px-3 py-2 border border-red-400 text-red-700 rounded-lg font-bold hover:bg-red-100 disabled:opacity-40"
                          disabled={dangerZoneConfirm !== 'DELETE'}
                          onClick={() => { if (supabase && org) { supabase.from('leads').delete().eq('org_id', org.id).then(() => { setLeads([]); setDangerZoneConfirm(''); setShowDangerZone(false); }); } }}
                        >
                          Delete {leads.length} leads
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">Delete account</p>
                          <p className="text-xs text-slate-500">Permanently deletes your account and all data. Cannot be undone.</p>
                        </div>
                        <button
                          className="text-xs px-3 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-40"
                          disabled={dangerZoneConfirm !== 'DELETE'}
                          onClick={() => alert('To delete your account, email support@stoklync.com with subject: "Delete my account"')}
                        >
                          Delete account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
