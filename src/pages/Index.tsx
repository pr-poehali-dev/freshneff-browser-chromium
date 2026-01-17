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
  const [history, setHistory] = useState<string[]>(['https://freshneff.dev']);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const navigateUrl = (newUrl?: string) => {
    const targetUrl = newUrl || url;
    const updatedTabs = tabs.map(tab => 
      tab.id === activeTab ? { ...tab, url: targetUrl, title: new URL(targetUrl).hostname } : tab
    );
    setTabs(updatedTabs);
    setUrl(targetUrl);
    
    const newHistory = [...history.slice(0, historyIndex + 1), targetUrl];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    toast.success('Переход: ' + new URL(targetUrl).hostname);
    setConsoleLog(prev => [...prev, `[Navigation] Loading: ${targetUrl}`]);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setUrl(previousUrl);
      
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTab ? { ...tab, url: previousUrl } : tab
      );
      setTabs(updatedTabs);
      
      toast.info('Назад: ' + new URL(previousUrl).hostname);
      setConsoleLog(prev => [...prev, `[Navigation] Back to: ${previousUrl}`]);
    } else {
      toast.info('Это первая страница в истории');
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextUrl = history[newIndex];
      setHistoryIndex(newIndex);
      setUrl(nextUrl);
      
      const updatedTabs = tabs.map(tab => 
        tab.id === activeTab ? { ...tab, url: nextUrl } : tab
      );
      setTabs(updatedTabs);
      
      toast.info('Вперёд: ' + new URL(nextUrl).hostname);
      setConsoleLog(prev => [...prev, `[Navigation] Forward to: ${nextUrl}`]);
    } else {
      toast.info('Это последняя страница в истории');
    }
  };

  const refresh = () => {
    toast.success('Обновление: ' + new URL(url).hostname);
    setConsoleLog(prev => [...prev, `[Navigation] Refreshing: ${url}`]);
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

  const globalSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setConsoleLog([...consoleLog, `[Search] Starting search: "${searchQuery}"`]);
      
      try {
        const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`);
        const data = await response.json();
        
        const results: Array<{title: string, url: string, description: string}> = [];
        
        if (data.AbstractText) {
          results.push({
            title: data.Heading || searchQuery,
            url: data.AbstractURL || `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
            description: data.AbstractText
          });
        }
        
        if (data.RelatedTopics && data.RelatedTopics.length > 0) {
          data.RelatedTopics.slice(0, 8).forEach((topic: any) => {
            if (topic.Text && topic.FirstURL) {
              results.push({
                title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
                url: topic.FirstURL,
                description: topic.Text
              });
            }
          });
        }
        
        if (results.length === 0) {
          results.push(
            {
              title: `${searchQuery} - DuckDuckGo`,
              url: `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`,
              description: `Поиск "${searchQuery}" в DuckDuckGo - конфиденциальный поисковик без отслеживания`
            },
            {
              title: `${searchQuery} - Google`,
              url: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
              description: `Поиск "${searchQuery}" в Google для получения самых актуальных результатов`
            },
            {
              title: `${searchQuery} - Яндекс`,
              url: `https://yandex.ru/search/?text=${encodeURIComponent(searchQuery)}`,
              description: `Поиск "${searchQuery}" в Яндекс - лучшие результаты для русскоязычного интернета`
            },
            {
              title: `${searchQuery} - Википедия`,
              url: `https://ru.wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`,
              description: `Статья о "${searchQuery}" в свободной энциклопедии Википедия`
            },
            {
              title: `${searchQuery} - YouTube`,
              url: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`,
              description: `Видео о "${searchQuery}" на YouTube - обучающие ролики и обзоры`
            }
          );
        }
        
        setSearchResults(results);
        setIsSearching(false);
        const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`;
        setUrl(searchUrl);
        
        const newHistory = [...history.slice(0, historyIndex + 1), searchUrl];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        toast.success(`Найдено ${results.length} результатов`);
        setConsoleLog(prev => [...prev, `[Search] Completed: "${searchQuery}" - ${results.length} results`]);
      } catch (error) {
        console.error('Search error:', error);
        setIsSearching(false);
        toast.error('Ошибка поиска. Попробуйте снова.');
        setConsoleLog(prev => [...prev, `[Search] Error: ${error}`]);
      }
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
                      <Card 
                        key={bookmark.id} 
                        className="p-3 hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          navigateUrl(bookmark.url);
                          toast.success(`Открыта закладка: ${bookmark.title}`);
                        }}
                      >
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
                  <Card 
                    key={index} 
                    className="p-5 hover:shadow-md transition-shadow cursor-pointer group"
                    onClick={() => {
                      navigateUrl(result.url);
                      setSearchResults([]);
                      setSearchQuery('');
                    }}
                  >
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-primary group-hover:underline">{result.title}</h3>
                      <p className="text-sm text-secondary break-all">{result.url}</p>
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