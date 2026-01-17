import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface Extension {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

const Index = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Новая вкладка', url: 'https://freshneff.dev' }
  ]);
  const [activeTab, setActiveTab] = useState('1');
  const [url, setUrl] = useState('https://freshneff.dev');
  const [searchQuery, setSearchQuery] = useState('');
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  const [devToolsTab, setDevToolsTab] = useState('console');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [extensions, setExtensions] = useState<Extension[]>([
    { id: '1', name: 'AdBlock Plus', enabled: true, description: 'Блокировка рекламы' },
    { id: '2', name: 'Dark Reader', enabled: false, description: 'Темная тема для сайтов' },
    { id: '3', name: 'Password Manager', enabled: true, description: 'Управление паролями' }
  ]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: '1', title: 'GitHub', url: 'https://github.com' },
    { id: '2', title: 'Stack Overflow', url: 'https://stackoverflow.com' }
  ]);
  const [consoleLog, setConsoleLog] = useState<string[]>([
    'FreshNeff Browser Console v1.0.0',
    'Ready to debug your applications'
  ]);
  const [searchResults, setSearchResults] = useState<Array<{title: string, url: string, description: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pageContent, setPageContent] = useState('');
  const [isDefaultBrowser, setIsDefaultBrowser] = useState(false);

  const addTab = () => {
    const newId = String(tabs.length + 1);
    setTabs([...tabs, { id: newId, title: 'Новая вкладка', url: 'https://freshneff.dev' }]);
    setActiveTab(newId);
  };

  const closeTab = (id: string) => {
    if (tabs.length === 1) {
      toast.info('Нельзя закрыть последнюю вкладку');
      return;
    }
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[0].id);
    }
  };

  const navigateUrl = () => {
    toast.success('Навигация к ' + url);
    setConsoleLog([...consoleLog, `[Navigation] Loading: ${url}`]);
  };

  const goBack = () => {
    toast.info('Назад');
    setConsoleLog([...consoleLog, '[Navigation] Going back']);
  };

  const goForward = () => {
    toast.info('Вперёд');
    setConsoleLog([...consoleLog, '[Navigation] Going forward']);
  };

  const refresh = () => {
    toast.success('Обновление страницы');
    setConsoleLog([...consoleLog, '[Navigation] Refreshing page']);
  };

  const toggleExtension = (id: string) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
    const ext = extensions.find(e => e.id === id);
    toast.success(`${ext?.name} ${ext?.enabled ? 'отключено' : 'включено'}`);
  };

  const addBookmark = () => {
    const newBookmark = {
      id: String(bookmarks.length + 1),
      title: tabs.find(t => t.id === activeTab)?.title || 'Новая закладка',
      url: url
    };
    setBookmarks([...bookmarks, newBookmark]);
    toast.success('Закладка добавлена');
  };

  const searchInPage = () => {
    if (searchQuery.trim()) {
      const mockPageContent = `Демонстрационное содержимое страницы FreshNeff Browser. 
      FreshNeff - это современный браузер на базе Chromium с полной поддержкой веб-стандартов.
      Встроенные инструменты разработчика помогают создавать и отлаживать приложения.
      Расширения позволяют настроить браузер под ваши нужды.`;
      
      setPageContent(mockPageContent);
      const found = mockPageContent.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (found) {
        toast.success(`Найдено совпадений на странице`);
        setConsoleLog([...consoleLog, `[Search] Found "${searchQuery}" on page`]);
      } else {
        toast.info(`"${searchQuery}" не найдено на странице`);
        setConsoleLog([...consoleLog, `[Search] "${searchQuery}" not found on page`]);
      }
    }
  };

  const globalSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      
      const mockResults = [
        {
          title: `${searchQuery} - Википедия`,
          url: `https://wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`,
          description: `Подробная статья о ${searchQuery}. История, определение, примеры использования и связанные темы.`
        },
        {
          title: `Что такое ${searchQuery}? Полное руководство`,
          url: `https://example.com/guide/${encodeURIComponent(searchQuery)}`,
          description: `Исчерпывающее руководство по ${searchQuery} для начинающих и профессионалов. Примеры, советы и лучшие практики.`
        },
        {
          title: `${searchQuery}: новости и обновления`,
          url: `https://news.example.com/${encodeURIComponent(searchQuery)}`,
          description: `Последние новости и обновления о ${searchQuery}. Актуальная информация из надежных источников.`
        },
        {
          title: `Купить ${searchQuery} онлайн - лучшие цены`,
          url: `https://shop.example.com/search?q=${encodeURIComponent(searchQuery)}`,
          description: `Большой выбор ${searchQuery} с доставкой. Сравнение цен, отзывы покупателей, гарантия качества.`
        },
        {
          title: `Видео о ${searchQuery} - обучающие материалы`,
          url: `https://videos.example.com/search/${encodeURIComponent(searchQuery)}`,
          description: `Образовательные видео и курсы по ${searchQuery}. Пошаговые инструкции и практические примеры.`
        }
      ];
      
      setTimeout(() => {
        setSearchResults(mockResults);
        setIsSearching(false);
        setUrl(`https://search.freshneff.dev/q=${encodeURIComponent(searchQuery)}`);
        toast.success(`Найдено ${mockResults.length} результатов`);
        setConsoleLog([...consoleLog, `[Search] Global search completed: "${searchQuery}" - ${mockResults.length} results`]);
      }, 500);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    toast.success(`Тема: ${newTheme === 'dark' ? 'Тёмная' : 'Светлая'}`);
  };

  const inspectElement = () => {
    setDevToolsOpen(true);
    setDevToolsTab('inspector');
    toast.info('Инспектор элементов открыт');
  };

  const setAsDefaultBrowser = () => {
    setIsDefaultBrowser(true);
    toast.success('FreshNeff установлен браузером по умолчанию');
    setConsoleLog([...consoleLog, '[System] FreshNeff set as default browser']);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-sidebar text-sidebar-foreground p-2 flex items-center gap-2 border-b border-sidebar-border">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goBack}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={goForward}>
            <Icon name="ChevronRight" size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={refresh}>
            <Icon name="RotateCw" size={16} />
          </Button>
        </div>

        <div className="flex-1 flex items-center gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && navigateUrl()}
            className="flex-1 bg-background/50"
            placeholder="Введите адрес или поисковый запрос"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={inspectElement}>
            <Icon name="Code" size={16} />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={addBookmark}>
            <Icon name="Star" size={16} />
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon name="Menu" size={16} />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px]">
            <SheetHeader>
              <SheetTitle>Меню FreshNeff</SheetTitle>
              <SheetDescription>Настройки и управление браузером</SheetDescription>
            </SheetHeader>
            <Tabs defaultValue="settings" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="settings">Настройки</TabsTrigger>
                <TabsTrigger value="bookmarks">Закладки</TabsTrigger>
                <TabsTrigger value="extensions">Расширения</TabsTrigger>
              </TabsList>

              <TabsContent value="settings" className="space-y-4">
                <Card className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Тёмная тема</Label>
                      <p className="text-sm text-muted-foreground">Включить темное оформление</p>
                    </div>
                    <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Защита от фишинга</Label>
                      <p className="text-sm text-muted-foreground">Блокировка опасных сайтов</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Антивирус</Label>
                      <p className="text-sm text-muted-foreground">Проверка загрузок</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Синхронизация</Label>
                      <p className="text-sm text-muted-foreground">Синхронизация между устройствами</p>
                    </div>
                    <Switch />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-base">Браузер по умолчанию</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isDefaultBrowser 
                          ? 'FreshNeff является браузером по умолчанию' 
                          : 'Сделайте FreshNeff основным браузером'}
                      </p>
                    </div>
                    <Button 
                      onClick={setAsDefaultBrowser} 
                      disabled={isDefaultBrowser}
                      className="w-full"
                      variant={isDefaultBrowser ? 'outline' : 'default'}
                    >
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      {isDefaultBrowser ? 'Установлен по умолчанию' : 'Сделать по умолчанию'}
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="bookmarks">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {bookmarks.map(bookmark => (
                      <Card key={bookmark.id} className="p-3 hover:bg-accent transition-colors cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Icon name="Star" size={16} className="text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{bookmark.title}</p>
                            <p className="text-sm text-muted-foreground truncate">{bookmark.url}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="extensions">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {extensions.map(extension => (
                      <Card key={extension.id} className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{extension.name}</h4>
                              {extension.enabled && (
                                <Badge variant="default" className="bg-secondary">Активно</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{extension.description}</p>
                          </div>
                          <Switch
                            checked={extension.enabled}
                            onCheckedChange={() => toggleExtension(extension.id)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-card border-b border-border flex items-center gap-1 px-2 py-1">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              activeTab === tab.id
                ? 'bg-background border border-border'
                : 'hover:bg-muted'
            }`}
          >
            <Icon name="Globe" size={14} />
            <span className="text-sm max-w-[150px] truncate">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="hover:bg-muted rounded p-0.5"
            >
              <Icon name="X" size={12} />
            </button>
          </div>
        ))}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addTab}>
          <Icon name="Plus" size={14} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white dark:bg-gray-900 flex items-center justify-center relative overflow-auto">
          {searchResults.length === 0 ? (
            <div className="text-center space-y-4 z-10 px-4">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Icon name="Compass" size={48} className="text-primary" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  FreshNeff Browser
                </h1>
              </div>
              <p className="text-muted-foreground text-lg">Ваш новый Chromium-браузер</p>
              
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    placeholder="Поиск в интернете или на странице..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && globalSearch()}
                    className="flex-1 h-14 text-lg px-6"
                  />
                  <Button onClick={searchInPage} variant="outline" size="lg" className="h-14 px-6">
                    <Icon name="Search" size={20} className="mr-2" />
                    На странице
                  </Button>
                  <Button onClick={globalSearch} size="lg" className="h-14 px-6" disabled={isSearching}>
                    <Icon name="Globe" size={20} className="mr-2" />
                    {isSearching ? 'Поиск...' : 'Глобально'}
                  </Button>
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button variant="outline" onClick={() => setDevToolsOpen(!devToolsOpen)}>
                  <Icon name="Code" size={16} className="mr-2" />
                  DevTools
                </Button>
                <Button variant="outline" onClick={toggleTheme}>
                  <Icon name="Palette" size={16} className="mr-2" />
                  Сменить тему
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full p-8 space-y-6">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-6">
                  <Button variant="ghost" size="icon" onClick={() => setSearchResults([])}>
                    <Icon name="ArrowLeft" size={20} />
                  </Button>
                  <Input
                    placeholder="Поиск в интернете..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && globalSearch()}
                    className="flex-1 h-12 text-base px-4"
                  />
                  <Button onClick={globalSearch} size="lg" disabled={isSearching}>
                    <Icon name="Search" size={18} />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Найдено результатов: {searchResults.length}</p>
              </div>
              
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <Card key={index} className="p-5 hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-primary group-hover:underline">{result.title}</h3>
                      <p className="text-sm text-secondary">{result.url}</p>
                      <p className="text-muted-foreground">{result.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && (
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-secondary blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full bg-primary blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          )}
        </div>

        {devToolsOpen && (
          <div className="h-[300px] border-t border-border bg-card animate-in slide-in-from-bottom-10 duration-300">
            <Tabs value={devToolsTab} onValueChange={setDevToolsTab} className="h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <TabsList>
                  <TabsTrigger value="console">
                    <Icon name="Terminal" size={14} className="mr-2" />
                    Консоль
                  </TabsTrigger>
                  <TabsTrigger value="inspector">
                    <Icon name="Inspect" size={14} className="mr-2" />
                    Инспектор
                  </TabsTrigger>
                  <TabsTrigger value="debugger">
                    <Icon name="Bug" size={14} className="mr-2" />
                    Отладчик
                  </TabsTrigger>
                  <TabsTrigger value="network">
                    <Icon name="Network" size={14} className="mr-2" />
                    Сеть
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDevToolsOpen(false)}>
                  <Icon name="X" size={16} />
                </Button>
              </div>

              <TabsContent value="console" className="flex-1 p-4 overflow-auto font-mono text-sm">
                <div className="space-y-1">
                  {consoleLog.map((log, i) => (
                    <div key={i} className="text-muted-foreground hover:bg-muted px-2 py-1 rounded">
                      {log}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="inspector" className="flex-1 p-4 overflow-auto">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-primary">&lt;html lang="ru"&gt;</div>
                  <div className="pl-4">
                    <div className="text-secondary">&lt;head&gt;</div>
                    <div className="pl-4 text-muted-foreground">
                      &lt;title&gt;FreshNeff Browser&lt;/title&gt;
                    </div>
                    <div className="text-secondary">&lt;/head&gt;</div>
                  </div>
                  <div className="pl-4">
                    <div className="text-secondary">&lt;body&gt;</div>
                    <div className="pl-4 text-muted-foreground">
                      &lt;div class="app"&gt;...&lt;/div&gt;
                    </div>
                    <div className="text-secondary">&lt;/body&gt;</div>
                  </div>
                  <div className="text-primary">&lt;/html&gt;</div>
                </div>
              </TabsContent>

              <TabsContent value="debugger" className="flex-1 p-4 overflow-auto">
                <div className="space-y-4">
                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="PlayCircle" size={16} className="text-secondary" />
                      <span className="font-medium">Точки останова</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Нет активных точек останова</p>
                  </Card>
                  <Card className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Layers" size={16} className="text-primary" />
                      <span className="font-medium">Стек вызовов</span>
                    </div>
                    <div className="font-mono text-xs text-muted-foreground space-y-1">
                      <div>→ main.tsx:12</div>
                      <div className="pl-4">App.tsx:24</div>
                      <div className="pl-4">Index.tsx:8</div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="network" className="flex-1 p-4 overflow-auto">
                <div className="space-y-2">
                  {[
                    { name: 'main.tsx', status: 200, type: 'script', size: '45 KB' },
                    { name: 'styles.css', status: 200, type: 'stylesheet', size: '12 KB' },
                    { name: 'api/data', status: 200, type: 'xhr', size: '8 KB' }
                  ].map((req, i) => (
                    <Card key={i} className="p-3 hover:bg-accent transition-colors cursor-pointer">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 flex-1">
                          <Badge variant="outline" className="font-mono">{req.status}</Badge>
                          <span className="font-medium">{req.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{req.type}</span>
                          <span>{req.size}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;