# add your new word anywhere in wordlist.txt, then run the following command to sort
pbcopy .wordlist.txt && pbpaste | uniq | sort | pbcopy && pbpaste > .wordlist.txt