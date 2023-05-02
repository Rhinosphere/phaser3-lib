import { marked } from 'marked';

var content = `\
# H1: xxxx

*H1.Content*
H1.Content
H1.Content

## H2: xxxx

|||talk
H2.Content
H2.Content
H2.Content
|||

## H3: xxxx

H3.Content
H3.Content
H3.Content


## H21: xxxx

H21.Content
H21.Content
H21.Content

`

content = content.replaceAll('|', '`');

// console.log(marked.parse(content))
console.log(JSON.stringify(marked.lexer(content)))