import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface NewsItem {
  title: string;
  link: string;
  date?: string;
  image?: string;
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=Campinas&lang=pt&token=55fcc4f0d4649b1a917a75b5eb896d69&max=10`
        );
        const data = await res.json();
        const items: NewsItem[] = data.articles.map((a: any) => ({
          title: a.title,
          link: a.url,
          date: new Date(a.publishedAt).toLocaleString("pt-BR"),
          image: a.image || "/placeholder-400x300.png",
        }));
        setNews(items);
      } catch (err) {
        console.error(err);
        setNews([
          { title: "Nenhuma notícia disponível", link: "#", image: "/placeholder-400x300.png", date: "—" }
        ]);
      }
    }

    fetchNews();
  }, []);

  // Passa para a próxima notícia a cada 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [news]);

  const item = news[currentIndex] || { title: "Carregando...", link: "#", image: "/placeholder-400x300.png", date: "—" };

  return (
    <div className="bg-white rounded-2xl mb-4 overflow-hidden">
      {/* Título do bloco */}
      <div className="px-5 pt-5">
        <h3 className="font-semibold text-gray-700 text-base mb-3">... Notícias — Campinas! </h3>
      </div>

      {/* Card da notícia */}
      <div className="relative w-full h-60 rounded-3xl overflow-hidden mx-5 mb-5 shadow-md bg-white">
        <a href={item.link} target="_blank" rel="noopener noreferrer">
          <img src={item.image} alt={item.title} className="w-full h-32 object-cover rounded-t-3xl" />
        </a>

        {/* Área de texto separada da imagem */}
        <div className="p-4">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-medium text-gray-800 text-sm line-clamp-2 hover:underline mb-2"
          >
            {item.title}
          </a>
          <div className="flex items-center text-gray-500 text-xs gap-2">
            <Clock className="w-3 h-3" />
            {item.date}
          </div>
        </div>
      </div>
    </div>
  );
}
