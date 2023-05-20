import { format, formatDistanceToNow } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

import styles from "./Post.module.css"

import { Avatar } from "../Avatar/Avatar"
import { Comment } from "../Comment/Comment"
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react"

interface Author {
    name: string;
    role: string;
    avatarURL: string;
}

interface Content {
    type: "paragraph" | "link";
    content: string
}

interface PostProps {
    author: Author;
    publishedAt: Date;
    content: Content[];

}

export const Post = ({ author, publishedAt, content }: PostProps) => {

    const [comments, setComments] = useState([
        "O primeiro post a gente nunca esquece!"
    ])

    const [newCommentText, setNewCommentText] = useState("")

    const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'ás' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    const handleCreateNewComment = (event: FormEvent) => {
        event.preventDefault()

        setComments([...comments, newCommentText])

        setNewCommentText("")
    }

    const handleNewCommentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        event.target.setCustomValidity("")

        setNewCommentText(event.target.value)
    }

    const handleNewCommentInvalid = (event: InvalidEvent<HTMLTextAreaElement>) => {
        event.target.setCustomValidity("Tá tirando meu? Preencha o formulario!")
    }

    const deleteComment = (commentToDelete: string) => {

        const newComments = comments.filter(comment => comment !== commentToDelete);

        setComments(newComments)
    }

    const isNewCommentEmpty = newCommentText.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={author.avatarURL} />
                    <div className={styles.authorInfo}>
                        <strong>{author.name}</strong>
                        <span>{author.role}</span>
                    </div>
                </div>
                <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>
            <div className={styles.content}>
                {content.map(line => {
                    if (line.type === "paragraph") {
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type === "link") {
                        return <p key={line.content}><a href="#">{line.content}</a> </p>
                    }
                })}

            </div>
            <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
                <strong>Deixe seu feedback</strong>
                <textarea
                    name="comment"
                    placeholder="Deixe um comentario"
                    value={newCommentText}
                    onChange={handleNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required={true}
                />

                <footer>
                    <button
                        disabled={isNewCommentEmpty}
                        type="submit">
                        Publicar
                    </button>
                </footer>

            </form>
            <div className={styles.commentList}>
                {comments.map(comment => {
                    return (
                        <Comment
                            key={comment}
                            content={comment}
                            onDeleteComment={deleteComment}
                        />
                    )
                })}
            </div>
        </article>
    )
}