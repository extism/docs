# add your new word anywhere in wordlist.txt, then run the following command to sort
# if not on a mac, set these aliases:
# alias pbcopy='xclip -selection clipboard'
# alias pbpaste='xclip -selection clipboard -o'
pbcopy .wordlist.txt && pbpaste | uniq | sort | pbcopy && pbpaste > .wordlist.txt