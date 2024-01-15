import Post from "@/database/models/postModel"

const constructPost = (post, feedId, userId) => {
    const slug = post.title.replace(/[^a-zA-Z0-9 ]/g, '')
    return new Post({
        title: (post.title || post.content.slice(0,30)) ?? post.link,
        creator: (post.creator || post['dc:creator']) ?? null,
        slug: post.title ? slug.replaceAll(' ', '_') : Date.now(),
        link: post.link ?? null,
        pubDate: post.isoDate || post.pubDate || post['dc:date'],
        description: post.description ?? null,
        content: (post.content || post['content:encoded'] || post.contentSnippet) ?? null,
        media: (post.enclosure?.url || post['media:content']?.url || post['media:thumbnail']?.url) ?? null,
        feed: feedId,
        user: userId
    })
}

export default constructPost