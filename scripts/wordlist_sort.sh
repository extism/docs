# add your new word anywhere in wordlist.txt, then run the following command to sort
cat .wordlist.txt | uniq | sort > /tmp/worldlist.txt && cp /tmp/worldlist.txt .wordlist.txt
