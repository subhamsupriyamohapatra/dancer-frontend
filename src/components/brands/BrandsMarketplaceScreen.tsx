import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Sparkles,
  ExternalLink,
  Tag,
  PlusCircle,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Filter,
  Info,
} from 'lucide-react';
import {
  BrandRecord,
  BrandCategory,
  SuggestBrandPayload,
} from '../../types/brand';
import { ScreenType } from '../../types';

interface BrandsMarketplaceScreenProps {
  brands: BrandRecord[];
  onSuggestBrand: (payload: SuggestBrandPayload) => void;
  onNavigate: (screen: ScreenType) => void;
}

const CATEGORY_TABS: { id: BrandCategory; label: string }[] = [
  { id: 'all', label: 'All Brands' },
  { id: 'footwear', label: 'Footwear & Grip' },
  { id: 'apparel', label: 'Apparel & Dancewear' },
  { id: 'makeup', label: 'Stage Makeup & Hair' },
  { id: 'hydration_nutrition', label: 'Hydration & Nutrition' },
  { id: 'recovery', label: 'Muscle Recovery' },
  { id: 'audio_sound', label: 'Cypher & Studio Audio' },
  { id: 'flooring_protection', label: 'Floor Protection' },
  { id: 'accessories', label: 'Accessories & Ghungroo' },
];

export const BrandsMarketplaceScreen: React.FC<BrandsMarketplaceScreenProps> = ({
  brands,
  onSuggestBrand,
  onNavigate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<BrandCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [selectedBrandModal, setSelectedBrandModal] = useState<BrandRecord | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Suggest Form State
  const [suggestForm, setSuggestForm] = useState<SuggestBrandPayload>({
    name: '',
    tagline: '',
    category: 'apparel',
    websiteUrl: '',
    instagramHandle: '',
    danceStylesSupported: ['Contemporary'],
    description: '',
    suggestedByUserName: '',
    contactEmail: '',
  });
  const [suggestSuccess, setSuggestSuccess] = useState(false);

  // Non-negotiable Rule 1: ONLY approved brands are publicly visible
  const approvedBrands = brands.filter((b) => b.approvalStatus === 'APPROVED');

  const filteredBrands = approvedBrands.filter((b) => {
    const matchesCategory =
      selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.danceStylesSupported.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredBrands = approvedBrands.filter((b) => b.isFeatured);

  const handleCopyDiscount = (brandId: string, code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCodeId(brandId);
    setTimeout(() => setCopiedCodeId(null), 3000);
  };

  const handleSuggestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestForm.name || !suggestForm.websiteUrl) return;

    onSuggestBrand(suggestForm);
    setSuggestSuccess(true);
    setTimeout(() => {
      setSuggestSuccess(false);
      setIsSuggestModalOpen(false);
      setSuggestForm({
        name: '',
        tagline: '',
        category: 'apparel',
        websiteUrl: '',
        instagramHandle: '',
        danceStylesSupported: ['Contemporary'],
        description: '',
        suggestedByUserName: '',
        contactEmail: '',
      });
    }, 2000);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 space-y-8 pb-24 text-white font-sans">
      {/* 1. TOP HEADER & SUGGEST ACTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              VETTED DANCER ESSENTIALS
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">{approvedBrands.length} Certified Brands</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <span>Dance-Friendly Brands Marketplace</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Curated equipment, performance shoes, sweat-proof stage makeup, and recovery tools approved for dancers in Bhubaneswar, Cuttack &amp; beyond.
          </p>
        </div>

        {/* Suggest Brand CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsSuggestModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-white/5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>Suggest a Brand</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR & CATEGORY FILTER TABS */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands, dance shoes, electrolytes, ghungroos..."
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-white/10 focus:border-amber-400/60 rounded-xl text-xs sm:text-sm text-white placeholder:text-zinc-500 outline-none transition-all"
          />
        </div>

        {/* Horizontally Scrollable Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. FEATURED BRANDS CAROUSEL */}
      {featuredBrands.length > 0 && selectedCategory === 'all' && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                Featured Partner Brands with Exclusive Dancer Perks
              </h2>
            </div>
            <span className="text-xs text-amber-300 font-mono">DanceOne Member Codes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredBrands.map((b) => (
              <div
                key={b.id}
                className="rounded-3xl bg-zinc-900/80 border border-white/10 hover:border-amber-500/40 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 group"
              >
                <div>
                  {/* Top: Logo & Discount Tag */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.logoUrl}
                        alt={b.name}
                        className="w-12 h-12 rounded-2xl object-cover bg-black border border-white/10"
                      />
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors">
                          {b.name}
                        </h3>
                        <span className="text-[11px] font-mono text-zinc-400 block">
                          {b.instagramHandle || b.cityAvailability}
                        </span>
                      </div>
                    </div>

                    {b.discountPercent && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-extrabold shrink-0">
                        {b.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
                    {b.description}
                  </p>

                  {/* Discipline tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {b.danceStylesSupported.slice(0, 3).map((st) => (
                      <span
                        key={st}
                        className="px-2 py-0.5 rounded-lg bg-zinc-950 border border-white/5 text-[11px] font-medium text-zinc-400"
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Discount Code & Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  {b.discountCode ? (
                    <button
                      onClick={() => handleCopyDiscount(b.id, b.discountCode!)}
                      className="px-3 py-1.5 rounded-xl bg-black border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors hover:border-amber-400"
                      title="Click to copy promo code"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-400" />
                      <span>{copiedCodeId === b.id ? 'COPIED!' : b.discountCode}</span>
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-500 font-mono">Official Partner</span>
                  )}

                  <button
                    onClick={() => setSelectedBrandModal(b)}
                    className="text-xs font-bold text-white hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <span>View Gear</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. ALL APPROVED BRANDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            {selectedCategory === 'all'
              ? 'All Approved Dance-Friendly Brands'
              : CATEGORY_TABS.find((c) => c.id === selectedCategory)?.label}
          </h2>
          <span className="text-xs text-zinc-500 font-mono">
            Showing {filteredBrands.length} of {approvedBrands.length} approved brands
          </span>
        </div>

        {filteredBrands.length === 0 ? (
          <div className="rounded-3xl bg-zinc-950 border border-white/10 p-10 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No approved brands in this filter</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Know a brand that makes great dance shoes, gear, or recovery tools? Suggest it and our moderation team will review it.
            </p>
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 mt-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Suggest this Brand</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="rounded-3xl bg-zinc-900 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all group"
              >
                {/* Hero preview banner */}
                <div className="relative h-32 w-full overflow-hidden bg-black">
                  <img
                    src={brand.heroImageUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover brightness-[0.5] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                  
                  {/* Category pill */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-bold">
                    {brand.category.replace('_', ' ')}
                  </span>

                  {brand.discountPercent && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-amber-400 text-black text-xs font-mono font-bold">
                      {brand.discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <img
                        src={brand.logoUrl}
                        alt={brand.name}
                        className="w-8 h-8 rounded-xl object-cover bg-black border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-amber-200 transition-colors">
                          {brand.name}
                        </h3>
                        <p className="text-[11px] text-zinc-400 truncate">{brand.tagline}</p>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mt-2">
                      {brand.description}
                    </p>
                  </div>

                  {/* Sample product pill */}
                  {brand.featuredProducts && brand.featuredProducts.length > 0 && (
                    <div className="p-2.5 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="text-[10px] text-zinc-500 block">TOP PICK</span>
                        <span className="text-white font-medium truncate block">
                          {brand.featuredProducts[0].name}
                        </span>
                      </div>
                      <span className="font-mono text-amber-300 font-bold shrink-0">
                        {brand.featuredProducts[0].price}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    {brand.discountCode ? (
                      <button
                        onClick={() => handleCopyDiscount(brand.id, brand.discountCode!)}
                        className="px-2.5 py-1.5 rounded-lg bg-black border border-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span>{copiedCodeId === brand.id ? 'COPIED!' : brand.discountCode}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-zinc-500 font-mono">Approved Partner</span>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedBrandModal(brand)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                      >
                        Details
                      </button>
                      <a
                        href={brand.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        title="Open brand website"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. SUGGEST A BRAND MODAL (Non-negotiable Rule 1: Enters Admin Approval Queue) */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-lg w-full rounded-3xl bg-zinc-900 border border-white/10 p-6 sm:p-7 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Suggest a Dance-Friendly Brand
                  </h3>
                  <span className="text-xs text-zinc-400 font-mono">DanceOne Marketplace Curation</span>
                </div>
              </div>

              <button
                onClick={() => setIsSuggestModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rule 1 Disclosure Banner */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200 mb-5">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-white">Rule 1 Governance:</strong> Dancers may suggest brands, but user accounts cannot directly publish. Every suggestion enters the <span className="font-semibold text-amber-300">Admin Approval Queue</span> for quality review before public display.
              </p>
            </div>

            {suggestSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white">Brand Suggested Successfully!</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Thank you! Your submission has been transmitted to the DanceOne Admin Moderation Centre.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSuggestSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={suggestForm.name}
                    onChange={(e) => setSuggestForm({ ...suggestForm, name: e.target.value })}
                    placeholder="e.g. Capezio / Fast&Up / Sansha"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Primary Category *
                    </label>
                    <select
                      value={suggestForm.category}
                      onChange={(e) => setSuggestForm({ ...suggestForm, category: e.target.value as BrandCategory })}
                      className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs sm:text-sm text-white outline-none"
                    >
                      <option value="footwear">Footwear & Grip</option>
                      <option value="apparel">Apparel & Dancewear</option>
                      <option value="makeup">Stage Makeup & Hair</option>
                      <option value="hydration_nutrition">Hydration & Nutrition</option>
                      <option value="recovery">Muscle Recovery</option>
                      <option value="audio_sound">Sound & Cypher Audio</option>
                      <option value="flooring_protection">Floor Protection</option>
                      <option value="accessories">Accessories & Ghungroo</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Brand Website URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={suggestForm.websiteUrl}
                      onChange={(e) => setSuggestForm({ ...suggestForm, websiteUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={suggestForm.instagramHandle}
                    onChange={(e) => setSuggestForm({ ...suggestForm, instagramHandle: e.target.value })}
                    placeholder="@brand_official"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs sm:text-sm text-white placeholder:text-zinc-600 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Why is this brand beneficial for dancers? *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={suggestForm.description}
                    onChange={(e) => setSuggestForm({ ...suggestForm, description: e.target.value })}
                    placeholder="Describe product quality, durability, grip, or sweat resistance..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-white/10 focus:border-amber-400 text-xs text-white placeholder:text-zinc-600 outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={suggestForm.suggestedByUserName}
                      onChange={(e) => setSuggestForm({ ...suggestForm, suggestedByUserName: e.target.value })}
                      placeholder="Student / Dancer Name"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-300 block mb-1">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={suggestForm.contactEmail}
                      onChange={(e) => setSuggestForm({ ...suggestForm, contactEmail: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <span>Submit to Admin Approval Queue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. BRAND DETAILS MODAL */}
      {selectedBrandModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl w-full rounded-3xl bg-zinc-900 border border-white/10 p-6 sm:p-8 shadow-2xl relative my-auto space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedBrandModal.logoUrl}
                  alt={selectedBrandModal.name}
                  className="w-14 h-14 rounded-2xl object-cover bg-black border border-white/10"
                />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {selectedBrandModal.name}
                  </h3>
                  <span className="text-xs text-amber-300 font-mono">
                    {selectedBrandModal.tagline}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBrandModal(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {selectedBrandModal.description}
            </p>

            {/* Featured items */}
            {selectedBrandModal.featuredProducts.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
                  Recommended Dance Equipment &amp; Gear
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBrandModal.featuredProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl bg-zinc-950 border border-white/5 flex items-center gap-3"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-zinc-900 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white truncate block">
                          {p.name}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="font-mono text-amber-300 text-xs font-bold">{p.price}</span>
                          {p.badge && (
                            <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Exclusive Perk Banner */}
            {selectedBrandModal.discountCode && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white block">DanceOne Member Promo Code</span>
                  <span className="text-xs text-amber-200">
                    Apply at checkout on {selectedBrandModal.name} official store
                  </span>
                </div>
                <button
                  onClick={() => handleCopyDiscount(selectedBrandModal.id, selectedBrandModal.discountCode!)}
                  className="px-3.5 py-2 rounded-xl bg-black border border-amber-500/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copiedCodeId === selectedBrandModal.id ? 'COPIED!' : selectedBrandModal.discountCode}</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedBrandModal(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
              >
                Close
              </button>
              <a
                href={selectedBrandModal.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>Visit Store</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
