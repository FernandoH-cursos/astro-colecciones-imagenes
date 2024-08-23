import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import rss from "@astrojs/rss";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();


export const GET: APIRoute = async ({ params, request, site }) => {
  const blogPosts = await getCollection("blog");

  return rss({
    //* Ruta del archivo xsl para el estilo del rss
    // stylesheet: "/styles/rss.xsl",
    //* `<title>` campo en el xml generado
    title: "Fernando Blog",
    //* `<description>` campo en el xml generado
    description: "Un simple blog de mis aventuras con astro",
    //* Habilita algunas metadatas para que funcione el RSS
    xmlns: {
      media: "http://search.yahoo.com/mrss/",
    },
    //* Usa el "site" desde el contexto del endpoint
    // https://docs.astro.build/en/reference/api-reference/#contextsite
    site: site ?? "",
    //* Array de `<item>`s en el xml generado
    //* Consulta la sección "Generando `items`" para ejemplos utilizando colecciones de contenido y glob imports
    items: blogPosts.map(({ data, slug, body }) => ({
      title: data.title,
      pubDate: data.date,
      description: data.description,
      //* Ruta relativa a la raíz del sitio de posts escritos en markdown
      link: `posts/${slug}`,

      //* Agrega el contenido del blog, parsea el mardown y sanitiza el HTML 
      content: sanitizeHtml(parser.render(body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      //* Agrega la imagen del blog
      customData: `<media:content
        type="image/${data.image.format === "jpg" ? "jpeg" : "png"}"
        width="${data.image.width}"
        height="${data.image.height}"
        medium="image"
        url="${site + data.image.src}" />
      `,
    })),

    //* (opcional) inyecta xml personalizado como el idioma del feed
    customData: `<language>es-mx</language>`,
  });
};
