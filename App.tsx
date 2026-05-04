
import React, { useState, useRef, useEffect } from 'react';
import { Scene, ScriptState, SeoData, Language } from './types';
import { generateScenesBatch, generateSeoAssets, generateImage, generateSuggestions } from './services/geminiService';

const translations = {
  en: {
    header_subtitle: "Create high-fidelity physics-based cinematic scripts for Veo 3. Specializing in BeamNG.Drive style chaos.",
    theme_label: "Project Theme",
    theme_placeholder: "e.g. Extreme Police Chase Fail",
    total_scenes_label: "Total Scenes",
    start_btn: "Start Production",
    director_loading: "Director Loading...",
    active_project: "Active Project",
    status_label: "Production Status",
    init_engine: "Initializing Engine...",
    init_engine_desc: "The Virtual Director is crafting your high-physics cinematic sequences. Please hold.",
    writing_batch: "Director writing batch",
    production_progress: "Production in progress... No confirmation required",
    script_ready: "Full Script Ready",
    get_seo_btn: "Get SEO",
    download_json: "Download JSON",
    export_pdf: "Export PDF",
    new_story: "New Story",
    seo_assets_title: "SEO Optimizer Assets",
    copy_seo: "Copy All SEO Info",
    title_label: "Title",
    desc_label: "Description",
    gen_thumb: "Generate Thumbnail",
    choose_text: "Choose Thumbnail Text",
    create_viral_thumb: "Create Viral Thumbnail",
    rendering_masterpiece: "Rendering Masterpiece...",
    save_png: "Save PNG",
    regenerate: "Regenerate",
    recommended_themes: "Recommended Next Themes",
    copy_themes: "Copy All Themes",
    recommended_desc: "Select a suggested topic to instantly start a new BeamNG-style script production:",
    copied_alert: "Copied to clipboard!",
    sound_prefix: "Sound:",
    load_more_suggestions: "Load More Suggestions",
    loading_suggestions: "Loading suggestions...",
    veo_prompt_title: "Veo 3 Prompt",
    quota_error_title: "Quota Exceeded (Rate Limit)",
    quota_error_desc: "You have reached the maximum allowed requests for your current plan. Please wait about 60 seconds before trying again, or upgrade to a paid project."
  },
  vi: {
    header_subtitle: "Tạo kịch bản điện ảnh dựa trên vật lý cho Veo 3. Chuyên về phong cách hỗn loạn BeamNG.Drive.",
    theme_label: "Chủ đề dự án",
    theme_placeholder: "Vd: Cuộc rượt đuổi cảnh sát thất bại",
    total_scenes_label: "Tổng số cảnh",
    start_btn: "Bắt đầu sản xuất",
    director_loading: "Đang tải đạo diễn...",
    active_project: "Dự án hiện tại",
    status_label: "Trạng thái sản xuất",
    init_engine: "Đang khởi động engine...",
    init_engine_desc: "Đạo diễn ảo đang xây dựng các phân cảnh vật lý cao. Vui lòng chờ.",
    writing_batch: "Đạo diễn đang viết phần",
    production_progress: "Đang sản xuất... Không cần xác nhận",
    script_ready: "Kịch bản đã sẵn sàng",
    get_seo_btn: "Tạo SEO",
    download_json: "Tải JSON",
    export_pdf: "Xuất PDF",
    new_story: "Câu chuyện mới",
    seo_assets_title: "Công cụ tối ưu SEO",
    copy_seo: "Sao chép thông tin SEO",
    title_label: "Tiêu đề",
    desc_label: "Mô tả",
    gen_thumb: "Tạo ảnh thu nhỏ",
    choose_text: "Chọn chữ trên ảnh",
    create_viral_thumb: "Tạo Thumbnail Viral",
    rendering_masterpiece: "Đang vẽ kiệt tác...",
    save_png: "Lưu PNG",
    regenerate: "Tạo lại",
    recommended_themes: "Chủ đề gợi ý tiếp theo",
    copy_themes: "Sao chép các chủ đề",
    recommended_desc: "Chọn một chủ đề gợi ý để bắt đầu sản xuất kịch bản BeamNG mới ngay lập tức:",
    copied_alert: "Đã sao chép vào bộ nhớ tạm!",
    sound_prefix: "Âm thanh:",
    load_more_suggestions: "Tải thêm gợi ý",
    loading_suggestions: "Đang tải gợi ý...",
    veo_prompt_title: "Prompt Veo 3",
    quota_error_title: "Hết lượt sử dụng (Rate Limit)",
    quota_error_desc: "Bạn đã vượt quá giới hạn yêu cầu cho phép. Vui lòng đợi khoảng 60 giây rồi thử lại, hoặc nâng cấp lên gói trả phí."
  },
  ko: {
    header_subtitle: "Veo 3를 위한 고충실도 물리 기반 영화 스크립트 제작. BeamNG.Drive 스타일의 혼돈 전문.",
    theme_label: "프로젝트 테마",
    theme_placeholder: "예: 극한의 경찰 추격 실패",
    total_scenes_label: "총 장면 수",
    start_btn: "프로덕션 시작",
    director_loading: "감독 로딩 중...",
    active_project: "현재 프로젝트",
    status_label: "제작 상태",
    init_engine: "엔진 초기화 중...",
    init_engine_desc: "가상 감독이 물리 연산이 포함된 영화적 시퀀스를 제작하고 있습니다. 잠시만 기다려 주세요.",
    writing_batch: "감독이 배치 작성 중",
    production_progress: "제작 진행 중... 확인이 필요하지 않습니다",
    script_ready: "전체 스크립트 준비 완료",
    get_seo_btn: "SEO 가져오기",
    download_json: "JSON 다운로드",
    export_pdf: "PDF 내보내기",
    new_story: "새로운 이야기",
    seo_assets_title: "SEO 최적화 자산",
    copy_seo: "모든 SEO 정보 복사",
    title_label: "제목",
    desc_label: "설명",
    gen_thumb: "썸네일 생성",
    choose_text: "썸네일 텍스트 선택",
    create_viral_thumb: "바이럴 썸네일 생성",
    rendering_masterpiece: "걸작 렌더링 중...",
    save_png: "PNG 저장",
    regenerate: "다시 생성",
    recommended_themes: "권장 다음 테마",
    copy_themes: "모든 테마 복사",
    recommended_desc: "제안된 주제를 선택하여 즉시 새로운 BeamNG 스타일 스크립트 제작을 시작하세요:",
    copied_alert: "클립보드에 복사되었습니다!",
    sound_prefix: "소리:",
    load_more_suggestions: "추가 제안 로드",
    loading_suggestions: "제안 로드 중...",
    veo_prompt_title: "Veo 3 프롬프트",
    quota_error_title: "할당량 초과 (요율 제한)",
    quota_error_desc: "현재 플랜에 허용된 최대 요청 수에 도달했습니다. 다시 시도하기 전에 약 60초 정도 기다리거나 유료 프로젝트로 업그레이드하세요."
  },
  es: {
    header_subtitle: "Crea guiones cinematográficos de alta fidelidad basados en física para Veo 3. Especializados en el caos al estilo BeamNG.Drive.",
    theme_label: "Tema del Proyecto",
    theme_placeholder: "ej. Falla en persecución policial extrema",
    total_scenes_label: "Escenas Totales",
    start_btn: "Iniciar Producción",
    director_loading: "Cargando Director...",
    active_project: "Proyecto Activo",
    status_label: "Estado de Producción",
    init_engine: "Inicializando Motor...",
    init_engine_desc: "El Director Virtual está creando sus secuencias cinematográficas de alta física. Por favor, espere.",
    writing_batch: "Director escribiendo lote",
    production_progress: "Producción en progreso... No se requiere confirmación",
    script_ready: "Guion Completo Listo",
    get_seo_btn: "Obtener SEO",
    download_json: "Descargar JSON",
    export_pdf: "Exportar PDF",
    new_story: "Nueva Historia",
    seo_assets_title: "Activos del Optimizador SEO",
    copy_seo: "Copiar Toda la Información SEO" ,
    title_label: "Título",
    desc_label: "Descripción",
    gen_thumb: "Generar Miniatura",
    choose_text: "Elegir Texto de Miniatura",
    create_viral_thumb: "Crear Miniatura Viral",
    rendering_masterpiece: "Renderizando Obra Maestra...",
    save_png: "Guardar PNG",
    regenerate: "Regenerar",
    recommended_themes: "Próximos Temas Recomendados",
    copy_themes: "Copiar Todos los Temas",
    recommended_desc: "Selecciona un tema sugerido para comenzar instantáneamente una nueva producción de guiones al estilo BeamNG:",
    copied_alert: "¡Copiado al portapapeles!",
    sound_prefix: "Sonido:",
    load_more_suggestions: "Cargar más sugerencias",
    loading_suggestions: "Cargando sugerencias...",
    veo_prompt_title: "Prompt de Veo 3",
    quota_error_title: "Cuota Excedida (Límite de Velocidad)",
    quota_error_desc: "Ha alcanzado el máximo de solicitudes permitidas para su plan actual. Espere unos 60 segundos antes de intentar de nuevo o actualice a un proyecto de pago."
  }
};

const App: React.FC = () => {
  const [state, setState] = useState<ScriptState>({
    title: '',
    totalScenes: 38,
    currentBatch: 0,
    scenes: [],
    isGenerating: false,
    isGeneratingSeo: false,
    seoData: null,
    error: null,
    language: 'en',
    isGeneratingImage: false,
    thumbnailUrl: null,
    imageError: null,
  });

  const [inputTitle, setInputTitle] = useState('');
  const [inputTotal, setInputTotal] = useState(38);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [imgModel, setImgModel] = useState('gemini-2.5-flash-image');
  const [imgAspectRatio, setImgAspectRatio] = useState('16:9');
  const [customImgPrompt, setCustomImgPrompt] = useState('');
  const [selectedThumbText, setSelectedThumbText] = useState('');
  
  const t = translations[state.language];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.scenes]);

  useEffect(() => {
    if (state.seoData) {
      setCustomImgPrompt(state.seoData.thumbnailPrompt);
      if (state.seoData.thumbnailTextSuggestions?.length > 0) {
        setSelectedThumbText(state.seoData.thumbnailTextSuggestions[0]);
      }
    }
  }, [state.seoData]);

  useEffect(() => {
    if (state.currentBatch === 0 && suggestions.length === 0) {
      loadMoreSuggestions();
    }
  }, [state.language]);

  const loadMoreSuggestions = async () => {
    if (isGeneratingSuggestions) return;
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await generateSuggestions(5, suggestions, state.language);
      setSuggestions(prev => [...prev, ...newSuggestions]);
    } catch (err: any) {
      console.error("Error loading suggestions:", err);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const startProduction = async (title: string) => {
    const total = Math.max(1, Math.min(100, inputTotal));
    
    setState(prev => ({
      ...prev,
      title,
      totalScenes: total,
      currentBatch: 0,
      scenes: [],
      isGenerating: true,
      isGeneratingSeo: false,
      seoData: null,
      error: null,
      isGeneratingImage: false,
      thumbnailUrl: null,
      imageError: null,
    }));
    
    try {
      let allScenes: Scene[] = [];
      const numBatches = Math.ceil(total / 5);
      
      for (let batch = 1; batch <= numBatches; batch++) {
        const nextBatch = await generateScenesBatch(title, total, batch, allScenes, state.language);
        allScenes = [...allScenes, ...nextBatch].filter(s => s.id <= total);
        
        setState(prev => ({
          ...prev,
          scenes: allScenes,
          currentBatch: batch
        }));
      }
      
      setState(prev => ({ ...prev, isGenerating: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isGenerating: false, error: err.message }));
    }
  };

  const handleStart = () => {
    if (!inputTitle.trim()) return;
    startProduction(inputTitle);
  };

  const handleNewStory = () => {
    setState(prev => ({
      ...prev,
      title: '',
      currentBatch: 0,
      scenes: [],
      isGenerating: false,
      isGeneratingSeo: false,
      seoData: null,
      error: null,
      isGeneratingImage: false,
      thumbnailUrl: null,
      imageError: null,
    }));
    setInputTitle('');
  };

  const handleGenerateSeo = async () => {
    setState(prev => ({ ...prev, isGeneratingSeo: true, error: null }));
    try {
      const seo = await generateSeoAssets(state.title, state.scenes, state.language);
      setState(prev => ({ ...prev, seoData: seo, isGeneratingSeo: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isGeneratingSeo: false, error: err.message }));
    }
  };

  const handleGenerateThumbnail = async () => {
    setState(prev => ({ ...prev, isGeneratingImage: true, imageError: null }));
    
    const finalPrompt = `${customImgPrompt}. MANDATORY: Include the text "${selectedThumbText}" in large, bold, high-impact, cinematic English letters prominently on the image. Make it look like a viral YouTube thumbnail.`;
    
    try {
      const url = await generateImage(imgModel, finalPrompt, imgAspectRatio);
      setState(prev => ({ ...prev, thumbnailUrl: url, isGeneratingImage: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isGeneratingImage: false, imageError: err.message }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(t.copied_alert);
  };

  const copyAllSeo = () => {
    if (!state.seoData) return;
    const allText = `
${t.title_label}: ${state.seoData.title}
${t.desc_label}: ${state.seoData.description}
Hashtags: ${state.seoData.hashtags.join(' ')}
Keywords: ${state.seoData.keywords}
Thumbnail Prompt: ${state.seoData.thumbnailPrompt}
Thumbnail Text Suggestions: ${state.seoData.thumbnailTextSuggestions.join(', ')}
    `.trim();
    copyToClipboard(allText);
  };

  const copyAllThemes = () => {
    if (!state.seoData?.nextThemeSuggestions) return;
    const themesText = state.seoData.nextThemeSuggestions
      .map((t, i) => `${i + 1}. ${t}`)
      .join('\n');
    copyToClipboard(themesText);
  };

  const sanitizeFilename = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^\w\s-]/gi, "") 
      .trim()
      .replace(/\s+/g, "_") 
      .toLowerCase()
      .substring(0, 50);
  };

  const downloadImage = () => {
    if (!state.thumbnailUrl) return;
    const link = document.createElement('a');
    link.href = state.thumbnailUrl;
    link.download = `${sanitizeFilename(selectedThumbText || 'thumbnail')}.png`;
    link.click();
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify({
      project: state.title,
      totalScenes: state.totalScenes,
      timestamp: new Date().toISOString(),
      scenes: state.scenes,
      seo: state.seoData
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${state.title.replace(/\s+/g, '_').toLowerCase()}_script.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const setLanguage = (lang: Language) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const progress = (state.scenes.length / state.totalScenes) * 100;
  const isQuotaError = state.error?.includes('QUOTA_EXHAUSTED');

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center max-w-6xl mx-auto">
      <header className="w-full mb-8 text-center no-print relative">
        <div className="flex justify-end mb-4">
          <div className="relative inline-block glass-effect rounded-lg">
            <select 
              onChange={(e) => setLanguage(e.target.value as Language)} 
              value={state.language}
              className="bg-transparent text-gray-300 text-xs font-bold py-2 px-4 pr-8 rounded leading-tight focus:outline-none appearance-none cursor-pointer hover:text-white transition-colors"
            >
              <option value="en" className="bg-black text-white">ENGLISH</option>
              <option value="vi" className="bg-black text-white">TIẾNG VIỆT</option>
              <option value="ko" className="bg-black text-white">한국어</option>
              <option value="es" className="bg-black text-white">ESPAÑOL</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 7.293 8.172 5.858 9.615z"/></svg>
            </div>
          </div>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold beamng-orange mb-2 uppercase tracking-tighter">
          VEO 3 ACTION DIRECTOR
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          {t.header_subtitle}
        </p>
      </header>

      {state.currentBatch === 0 && !state.isGenerating && (
        <div className="w-full max-w-md glass-effect p-8 rounded-2xl shadow-2xl animate-fade-in no-print">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-widest">{t.theme_label}</label>
            <input type="text" className="w-full bg-black/50 border border-gray-700 rounded-lg p-3 focus:border-orange-500 outline-none transition-all text-white" placeholder={t.theme_placeholder} value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
          </div>
          <div className="mb-8">
            <label className="block text-sm font-semibold mb-2 text-gray-300 uppercase tracking-widest">{t.total_scenes_label}</label>
            <div className="flex items-center gap-4">
              <input type="number" min="1" max="100" className="w-24 bg-black/50 border border-gray-700 rounded-lg p-3 focus:border-orange-500 outline-none transition-all text-white" value={inputTotal} onChange={(e) => setInputTotal(parseInt(e.target.value) || 0)} />
              <span className="text-xs text-gray-500 italic">Recommended: 38</span>
            </div>
          </div>
          <button onClick={handleStart} disabled={!inputTitle.trim() || state.isGenerating} className="w-full beamng-bg-orange hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,102,0,0.3)] uppercase font-heading">
            {state.isGenerating ? t.director_loading : t.start_btn}
          </button>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{t.recommended_themes}</h3>
              {isGeneratingSuggestions && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] text-gray-400 animate-pulse">{t.loading_suggestions}</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((theme, i) => (
                <button
                  key={i}
                  disabled={state.isGenerating}
                  onClick={() => {
                    setInputTitle(theme);
                  }}
                  className={`group flex items-start gap-4 p-3 border rounded-xl transition-all text-left bg-black/40 ${inputTitle === theme ? 'border-orange-500 bg-orange-500/5' : 'border-white/5 hover:border-orange-500/30'}`}
                >
                  <span className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full font-bold text-[10px] transition-all ${inputTitle === theme ? 'bg-orange-500 text-white' : 'bg-blue-500/10 text-blue-400 group-hover:bg-orange-500 group-hover:text-white'}`}>
                    {i + 1}
                  </span>
                  <span className={`text-xs ${inputTitle === theme ? 'text-white' : 'text-gray-300'} transition-colors`}>{theme}</span>
                </button>
              ))}
            </div>
            <button 
              onClick={loadMoreSuggestions} 
              disabled={isGeneratingSuggestions || state.isGenerating}
              className="w-full py-2 border border-gray-700 rounded-lg text-[10px] font-bold text-gray-500 hover:text-white hover:border-gray-500 transition-all uppercase tracking-widest disabled:opacity-50"
            >
              {isGeneratingSuggestions ? '...' : t.load_more_suggestions}
            </button>
          </div>

          {state.error && (
            <div className={`mt-6 p-4 rounded-lg text-sm border ${isQuotaError ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
              {isQuotaError ? (
                <div>
                  <h4 className="font-bold mb-1 uppercase tracking-tight">{t.quota_error_title}</h4>
                  <p className="mb-2 opacity-80">{t.quota_error_desc}</p>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline font-bold text-orange-300 hover:text-white transition-colors">
                    Upgrade to Pay-as-you-go
                  </a>
                </div>
              ) : state.error}
            </div>
          )}
        </div>
      )}

      {(state.currentBatch > 0 || state.isGenerating) && (
        <div className="w-full flex flex-col h-[calc(100vh-250px)]">
          <div className="glass-effect p-4 rounded-t-2xl flex flex-wrap items-center justify-between gap-4 border-b-0 no-print">
            <div>
              <span className="text-xs text-gray-500 uppercase font-bold tracking-widest">{t.active_project}</span>
              <h2 className="text-xl font-heading text-white truncate max-w-[300px]">{state.title}</h2>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{t.status_label}</span>
                <span className="beamng-orange font-bold">{state.scenes.length} / {state.totalScenes}</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full beamng-bg-orange transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
              </div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto glass-effect p-4 space-y-4 border-y-0">
            {state.scenes.length === 0 && state.isGenerating && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-orange-500 font-heading text-lg animate-pulse uppercase tracking-widest">{t.init_engine}</p>
                <p className="text-gray-500 text-sm max-w-xs text-center">{t.init_engine_desc}</p>
              </div>
            )}

            {state.scenes.map((scene) => (
              <div key={scene.id} className="group relative bg-black/40 border border-white/5 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 animate-fade-in">
                <div className="absolute top-4 right-6 text-4xl font-heading opacity-5 text-white">{scene.id.toString().padStart(2, '0')}</div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 font-heading font-bold text-lg border border-orange-500/20">{scene.id}</div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t.veo_prompt_title}</h3>
                    <p className="text-gray-100 text-sm md:text-base mb-4">{scene.prompt}</p>
                    <div className="bg-white/5 rounded-lg p-3 flex items-start gap-3">
                      <span className="text-orange-500 mt-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V7h2v5zm4 4h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg></span>
                      <p className="text-xs italic text-gray-400"><span className="font-bold text-gray-300 uppercase not-italic">{t.sound_prefix}</span> {scene.soundVoice}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {state.seoData && (
              <div className="mt-12 space-y-12 animate-fade-in no-print">
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-2xl text-orange-500 flex items-center gap-3 uppercase">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {t.seo_assets_title}
                    </h3>
                    <button onClick={copyAllSeo} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-bold text-xs uppercase transition-all shadow-lg flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                      {t.copy_seo}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">{t.title_label} <span>{state.seoData.title.length}/60</span></label>
                        <input readOnly value={state.seoData.title} className="w-full bg-black/40 border border-white/10 p-2 rounded text-sm text-white mt-1" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.desc_label}</label>
                        <textarea readOnly value={state.seoData.description} rows={4} className="w-full bg-black/40 border border-white/10 p-2 rounded text-xs text-gray-300 resize-none mt-1" />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {state.seoData.hashtags.map((tag, i) => <span key={i} className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">{tag}</span>)}
                      </div>
                    </div>

                    <div className="bg-black/30 p-6 rounded-xl border border-white/5 space-y-4">
                      <h4 className="font-heading text-lg text-white uppercase border-b border-white/10 pb-2">{t.gen_thumb}</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{t.choose_text}</label>
                          <div className="grid grid-cols-2 gap-2">
                            {state.seoData.thumbnailTextSuggestions.map((text, i) => (
                              <button
                                key={i}
                                onClick={() => setSelectedThumbText(text)}
                                className={`p-2 text-[10px] font-bold rounded border transition-all ${selectedThumbText === text ? 'bg-orange-500 border-orange-500 text-white' : 'bg-black/50 border-white/10 text-gray-400 hover:border-orange-500/50'}`}
                              >
                                {text}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Model</label>
                            <select value={imgModel} onChange={(e) => setImgModel(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-xs text-white">
                              <option value="gemini-2.5-flash-image">Gemini 2.5 Flash (Fast)</option>
                              <option value="gemini-3-pro-image-preview">Gemini 3 Pro (High Quality)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ratio</label>
                            <select value={imgAspectRatio} onChange={(e) => setImgAspectRatio(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-xs text-white">
                              <option value="16:9">16:9</option>
                              <option value="9:16">9:16</option>
                              <option value="1:1">1:1</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Context</label>
                          <textarea value={customImgPrompt} onChange={(e) => setCustomImgPrompt(e.target.value)} className="w-full bg-black border border-white/20 p-2 rounded text-xs text-white h-20 resize-none" />
                        </div>
                      </div>
                      
                      {!state.thumbnailUrl && !state.isGeneratingImage && (
                        <button onClick={handleGenerateThumbnail} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg uppercase text-sm tracking-widest transition-all">
                          {t.create_viral_thumb}
                        </button>
                      )}

                      {state.isGeneratingImage && (
                        <div className="flex flex-col items-center py-4">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                          <span className="text-[10px] text-gray-400 uppercase animate-pulse">{t.rendering_masterpiece}</span>
                        </div>
                      )}

                      {state.thumbnailUrl && (
                        <div className="space-y-3 animate-fade-in">
                          <div className="relative group/img">
                            <img src={state.thumbnailUrl} alt="Thumbnail" className="w-full rounded-lg border border-white/20 shadow-2xl" />
                            <div className="absolute top-2 left-2 bg-orange-600 text-white text-[8px] font-bold px-2 py-1 rounded uppercase shadow-lg">
                              Live Preview: {selectedThumbText}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={downloadImage} className="flex-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold py-2 rounded uppercase flex items-center justify-center gap-2">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                              {t.save_png}
                            </button>
                            <button onClick={handleGenerateThumbnail} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-[10px] font-bold py-2 rounded uppercase">
                              {t.regenerate}
                            </button>
                          </div>
                        </div>
                      )}

                      {state.imageError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-[10px] text-center">
                          {state.imageError}
                          <button onClick={handleGenerateThumbnail} className="block w-full mt-2 underline font-bold">Try Again</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      <h3 className="font-heading text-2xl text-white uppercase">{t.recommended_themes}</h3>
                    </div>
                    <button 
                      onClick={copyAllThemes}
                      className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full font-bold text-xs uppercase transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                      {t.copy_themes}
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm">{t.recommended_desc}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.seoData.nextThemeSuggestions.map((theme, i) => (
                      <button
                        key={i}
                        disabled={state.isGenerating}
                        onClick={() => {
                          setInputTitle(theme);
                          startProduction(theme);
                        }}
                        className="group flex items-start gap-4 p-4 bg-black/40 border border-white/5 rounded-xl hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-left disabled:opacity-50"
                      >
                        <span className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-400 font-bold text-xs group-hover:bg-orange-500 group-hover:text-white transition-all">
                          {i + 1}
                        </span>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {state.isGenerating && state.scenes.length > 0 && (
              <div className="flex flex-col items-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-heading text-sm animate-pulse uppercase tracking-wider">{t.writing_batch} {state.currentBatch + 1}...</p>
              </div>
            )}

            {state.isGeneratingSeo && (
              <div className="flex flex-col items-center py-12 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 font-heading text-sm animate-pulse uppercase">{t.director_loading}</p>
              </div>
            )}
            
            {state.error && (
              <div className={`p-4 rounded-xl border animate-fade-in ${isQuotaError ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
                {isQuotaError ? (
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <div>
                      <h4 className="font-heading font-bold uppercase tracking-tight mb-1">{t.quota_error_title}</h4>
                      <p className="text-sm opacity-80 mb-3">{t.quota_error_desc}</p>
                      <div className="flex gap-3">
                        <button onClick={handleStart} className="bg-orange-500 text-black px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-orange-400 transition-colors">Try again</button>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="bg-white/10 border border-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-white/20 transition-colors">Upgrade plan</a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{state.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="glass-effect p-4 rounded-b-2xl border-t-0 flex justify-center no-print min-h-[80px]">
            {state.isGenerating ? (
              <div className="text-orange-500 font-heading font-bold text-sm uppercase tracking-widest animate-pulse flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                {t.production_progress}
              </div>
            ) : state.scenes.length >= state.totalScenes ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="text-green-500 flex items-center gap-2 font-heading font-bold animate-bounce uppercase">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  {t.script_ready}
                </div>
                <div className="flex flex-wrap justify-center items-center gap-4">
                  <button onClick={handleNewStory} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-xs uppercase font-heading">{t.new_story}</button>
                  <button onClick={downloadJson} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all text-xs uppercase font-heading">{t.download_json}</button>
                  <button onClick={() => window.print()} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all text-xs uppercase font-heading">{t.export_pdf}</button>
                  {!state.seoData && (
                    <button onClick={handleGenerateSeo} disabled={state.isGeneratingSeo} className="bg-gradient-to-r from-orange-600 to-red-600 hover:scale-105 text-white font-bold py-2 px-8 rounded-full transition-all flex items-center gap-2 text-sm uppercase font-heading">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      {t.get_seo_btn}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
        @media print {
          .glass-effect { background: white !important; color: black !important; backdrop-filter: none !important; border: 1px solid #ddd !important; }
          body { background: white !important; color: black !important; }
          .no-print, header, footer, button, .bg-blue-600, .bg-gray-700, select, textarea { display: none !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .h-\\[calc\\(100vh-250px\\)\\] { height: auto !important; }
          .overflow-y-auto { overflow: visible !important; }
          .beamng-orange { color: black !important; border-bottom: 2px solid #ff6600; }
          .group { border: 1px solid #eee !important; page-break-inside: avoid; margin-bottom: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default App;
