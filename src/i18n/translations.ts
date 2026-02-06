export type Language = 'es' | 'pt' | 'en' | 'zh';

export const LANGUAGES: Record<Language, { name: string; flag: string }> = {
  es: { name: 'Español', flag: '🇵🇾' },
  pt: { name: 'Português', flag: '🇧🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  zh: { name: '中文', flag: '🇨🇳' },
};

export const translations: Record<Language, Record<string, string>> = {
  es: {
    // Header
    'header.publish': 'Publicar',
    'header.login': 'Ingresar',
    'header.myProfile': 'Mi Perfil',
    'header.myListings': 'Mis Anuncios',
    'header.messages': 'Mensajes',
    'header.adminPanel': 'Panel Admin',
    'header.logout': 'Cerrar Sesión',
    'header.subtitle': 'Mercado Agrícola Digital',
    
    // Roles
    'role.consumidor': 'Consumidor',
    'role.productor': 'Productor',
    'role.prestador': 'Prestador de Servicios',
    'role.admin': 'Administrador',
    
    // Onboarding
    'onboarding.title': '¿Cómo vas a usar Kamps Py?',
    'onboarding.subtitle': 'Puedes elegir uno o más roles',
    'onboarding.consumidor.desc': 'Quiero comprar productos y servicios agrícolas',
    'onboarding.productor.desc': 'Quiero vender mis productos agrícolas',
    'onboarding.prestador.desc': 'Ofrezco servicios técnicos o profesionales',
    'onboarding.continue': 'Continuar',
    'onboarding.selectOne': 'Selecciona al menos un rol',
    
    // Categories
    'category.granos': 'Granos',
    'category.frutas-verduras': 'Frutas y Verduras',
    'category.ganaderia': 'Ganadería',
    'category.maquinaria': 'Maquinaria',
    'category.insumos': 'Insumos',
    'category.servicios': 'Servicios',
    'category.all': 'Todas las categorías',
    
    // Listing
    'listing.featured': 'Destacado',
    'listing.contact': 'Contactar',
    'listing.share': 'Compartir',
    'listing.edit': 'Editar',
    'listing.delete': 'Eliminar',
    'listing.deleteConfirm': '¿Estás seguro de que quieres eliminar este anuncio?',
    'listing.deleteDesc': 'Esta acción no se puede deshacer.',
    'listing.cancel': 'Cancelar',
    
    // Search
    'search.placeholder': 'Buscar productos, servicios...',
    'search.department': 'Departamento',
    'search.allDepartments': 'Todos los departamentos',
    
    // Profile
    'profile.title': 'Mi Perfil',
    'profile.name': 'Nombre o Razón Social',
    'profile.type': 'Tipo de Perfil',
    'profile.department': 'Departamento',
    'profile.city': 'Ciudad/Distrito',
    'profile.phone': 'Teléfono WhatsApp (privado)',
    'profile.phoneNote': 'Este número no se muestra públicamente.',
    'profile.description': 'Descripción breve (opcional)',
    'profile.save': 'Guardar Perfil',
    'profile.saving': 'Guardando...',
    'profile.updated': 'Perfil actualizado',
    'profile.language': 'Idioma preferido',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    
    // Common
    'common.back': 'Volver',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.noResults': 'No se encontraron resultados',
  },
  
  pt: {
    // Header
    'header.publish': 'Publicar',
    'header.login': 'Entrar',
    'header.myProfile': 'Meu Perfil',
    'header.myListings': 'Meus Anúncios',
    'header.messages': 'Mensagens',
    'header.adminPanel': 'Painel Admin',
    'header.logout': 'Sair',
    'header.subtitle': 'Mercado Agrícola Digital',
    
    // Roles
    'role.consumidor': 'Consumidor',
    'role.productor': 'Produtor',
    'role.prestador': 'Prestador de Serviços',
    'role.admin': 'Administrador',
    
    // Onboarding
    'onboarding.title': 'Como você vai usar o Kamps Py?',
    'onboarding.subtitle': 'Você pode escolher um ou mais papéis',
    'onboarding.consumidor.desc': 'Quero comprar produtos e serviços agrícolas',
    'onboarding.productor.desc': 'Quero vender meus produtos agrícolas',
    'onboarding.prestador.desc': 'Ofereço serviços técnicos ou profissionais',
    'onboarding.continue': 'Continuar',
    'onboarding.selectOne': 'Selecione pelo menos um papel',
    
    // Categories
    'category.granos': 'Grãos',
    'category.frutas-verduras': 'Frutas e Verduras',
    'category.ganaderia': 'Pecuária',
    'category.maquinaria': 'Maquinário',
    'category.insumos': 'Insumos',
    'category.servicios': 'Serviços',
    'category.all': 'Todas as categorias',
    
    // Listing
    'listing.featured': 'Destaque',
    'listing.contact': 'Contato',
    'listing.share': 'Compartilhar',
    'listing.edit': 'Editar',
    'listing.delete': 'Excluir',
    'listing.deleteConfirm': 'Tem certeza que deseja excluir este anúncio?',
    'listing.deleteDesc': 'Esta ação não pode ser desfeita.',
    'listing.cancel': 'Cancelar',
    
    // Search
    'search.placeholder': 'Buscar produtos, serviços...',
    'search.department': 'Departamento',
    'search.allDepartments': 'Todos os departamentos',
    
    // Profile
    'profile.title': 'Meu Perfil',
    'profile.name': 'Nome ou Razão Social',
    'profile.type': 'Tipo de Perfil',
    'profile.department': 'Departamento',
    'profile.city': 'Cidade/Distrito',
    'profile.phone': 'Telefone WhatsApp (privado)',
    'profile.phoneNote': 'Este número não é exibido publicamente.',
    'profile.description': 'Descrição breve (opcional)',
    'profile.save': 'Salvar Perfil',
    'profile.saving': 'Salvando...',
    'profile.updated': 'Perfil atualizado',
    'profile.language': 'Idioma preferido',
    
    // Auth
    'auth.login': 'Entrar',
    'auth.register': 'Cadastrar',
    'auth.email': 'E-mail',
    'auth.password': 'Senha',
    'auth.noAccount': 'Não tem conta?',
    'auth.hasAccount': 'Já tem conta?',
    
    // Common
    'common.back': 'Voltar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.noResults': 'Nenhum resultado encontrado',
  },
  
  en: {
    // Header
    'header.publish': 'Publish',
    'header.login': 'Login',
    'header.myProfile': 'My Profile',
    'header.myListings': 'My Listings',
    'header.messages': 'Messages',
    'header.adminPanel': 'Admin Panel',
    'header.logout': 'Logout',
    'header.subtitle': 'Digital Agricultural Market',
    
    // Roles
    'role.consumidor': 'Consumer',
    'role.productor': 'Producer',
    'role.prestador': 'Service Provider',
    'role.admin': 'Administrator',
    
    // Onboarding
    'onboarding.title': 'How will you use Kamps Py?',
    'onboarding.subtitle': 'You can choose one or more roles',
    'onboarding.consumidor.desc': 'I want to buy agricultural products and services',
    'onboarding.productor.desc': 'I want to sell my agricultural products',
    'onboarding.prestador.desc': 'I offer technical or professional services',
    'onboarding.continue': 'Continue',
    'onboarding.selectOne': 'Select at least one role',
    
    // Categories
    'category.granos': 'Grains',
    'category.frutas-verduras': 'Fruits & Vegetables',
    'category.ganaderia': 'Livestock',
    'category.maquinaria': 'Machinery',
    'category.insumos': 'Supplies',
    'category.servicios': 'Services',
    'category.all': 'All categories',
    
    // Listing
    'listing.featured': 'Featured',
    'listing.contact': 'Contact',
    'listing.share': 'Share',
    'listing.edit': 'Edit',
    'listing.delete': 'Delete',
    'listing.deleteConfirm': 'Are you sure you want to delete this listing?',
    'listing.deleteDesc': 'This action cannot be undone.',
    'listing.cancel': 'Cancel',
    
    // Search
    'search.placeholder': 'Search products, services...',
    'search.department': 'Department',
    'search.allDepartments': 'All departments',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.name': 'Name or Business Name',
    'profile.type': 'Profile Type',
    'profile.department': 'Department',
    'profile.city': 'City/District',
    'profile.phone': 'WhatsApp Phone (private)',
    'profile.phoneNote': 'This number is not shown publicly.',
    'profile.description': 'Short description (optional)',
    'profile.save': 'Save Profile',
    'profile.saving': 'Saving...',
    'profile.updated': 'Profile updated',
    'profile.language': 'Preferred language',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    
    // Common
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.noResults': 'No results found',
  },
  
  zh: {
    // Header
    'header.publish': '发布',
    'header.login': '登录',
    'header.myProfile': '我的资料',
    'header.myListings': '我的广告',
    'header.messages': '消息',
    'header.adminPanel': '管理面板',
    'header.logout': '退出',
    'header.subtitle': '数字农业市场',
    
    // Roles
    'role.consumidor': '消费者',
    'role.productor': '生产者',
    'role.prestador': '服务提供商',
    'role.admin': '管理员',
    
    // Onboarding
    'onboarding.title': '您将如何使用 Kamps Py？',
    'onboarding.subtitle': '您可以选择一个或多个角色',
    'onboarding.consumidor.desc': '我想购买农产品和服务',
    'onboarding.productor.desc': '我想出售我的农产品',
    'onboarding.prestador.desc': '我提供技术或专业服务',
    'onboarding.continue': '继续',
    'onboarding.selectOne': '请至少选择一个角色',
    
    // Categories
    'category.granos': '谷物',
    'category.frutas-verduras': '水果和蔬菜',
    'category.ganaderia': '畜牧业',
    'category.maquinaria': '机械',
    'category.insumos': '供应品',
    'category.servicios': '服务',
    'category.all': '所有类别',
    
    // Listing
    'listing.featured': '精选',
    'listing.contact': '联系',
    'listing.share': '分享',
    'listing.edit': '编辑',
    'listing.delete': '删除',
    'listing.deleteConfirm': '您确定要删除此广告吗？',
    'listing.deleteDesc': '此操作无法撤消。',
    'listing.cancel': '取消',
    
    // Search
    'search.placeholder': '搜索产品、服务...',
    'search.department': '省份',
    'search.allDepartments': '所有省份',
    
    // Profile
    'profile.title': '我的资料',
    'profile.name': '姓名或公司名称',
    'profile.type': '资料类型',
    'profile.department': '省份',
    'profile.city': '城市/地区',
    'profile.phone': 'WhatsApp 电话（私密）',
    'profile.phoneNote': '此号码不公开显示。',
    'profile.description': '简短描述（可选）',
    'profile.save': '保存资料',
    'profile.saving': '保存中...',
    'profile.updated': '资料已更新',
    'profile.language': '首选语言',
    
    // Auth
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.noAccount': '没有账户？',
    'auth.hasAccount': '已有账户？',
    
    // Common
    'common.back': '返回',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.noResults': '未找到结果',
  },
};
