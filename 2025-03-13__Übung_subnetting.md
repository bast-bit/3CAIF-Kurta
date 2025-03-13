# Übung Subnetting

## Übung 1

Bilde aus dem Netz 192.168.0.0 /24 4 Subnetze. Netze mit Mindestzahl an nutzbaren Host aber nicht darunter wählen: Netz a mit 20, Netz b mit 15, Netz c mit 30, und das Netz d mit den Rest Anteil der Netzwerkadressen.

**Antwort**

Netz a: 0-31    | 192.168.0.0 /27
Netz b: 32-63   | 192.168.0.32 /27
Netz c: 64-95   | 192.168.0.64 /27
Netz d: 128-255 | 192.168.0.96 /25



## Übung 2

Teile das Netz 193.170.20.0 /24 in 8 gleich große Netze! Erstelle eine Tabelle mit folgenden Angaben:
Netzwerkadresse,               nutzbare Hosts,                    Broadcastadresse,              Subnetzmaske.

**Antwort**
2 hoch 3 = 8  (3Bits vom Hosteil)
Subnetmask = 24 + 3 =27     | 2 hoch 5 = 32 Adressen pro Netz ( 32-2 wegen Netz und Broadcast- adresse)


| Subnetz | Netzwerkadresse  | Nutzbare Hosts | Broadcastadresse  | Subnetzmaske     |
|---------|------------------|----------------|-------------------|------------------|
| 1       | 193.170.20.0/27  | 1–30           | 193.170.20.31     | 255.255.255.224  |
| 2       | 193.170.20.32/27 | 33–62          | 193.170.20.63     | 255.255.255.224  |
| 3       | 193.170.20.64/27 | 65–94          | 193.170.20.95     | 255.255.255.224  |
| 4       | 193.170.20.96/27 | 97–126         | 193.170.20.127    | 255.255.255.224  |
| 5       | 193.170.20.128/27| 129–158        | 193.170.20.159    | 255.255.255.224  |
| 6       | 193.170.20.160/27| 161–190        | 193.170.20.191    | 255.255.255.224  |
| 7       | 193.170.20.192/27| 193–222        | 193.170.20.223    | 255.255.255.224  |
| 8       | 193.170.20.224/27| 225–254        | 193.170.20.255    | 255.255.255.224  |

Quelle: http://www.jodies.de/ipcalc


## Übung 3

172.28.40.0 /26 Teile wie folgt auf: 2 Netze!
Erstelle eine Tabelle mit folgenden Angaben:
Netzwerkadresse,               nutzbare Hosts,                    Broadcastadresse,              Subnetzmaske.

**Antwort**
| Netz      | Netzwerkadresse | Nutzbare Hosts | Broadcastadresse | Subnetzmaske   | CIDR |
|-----------|-----------------|----------------|------------------|----------------|------|
| 1. Netz   | 172.28.40.0     | 1-30           | 172.28.40.31     | 255.255.255.224| /27  |
| 2. Netz   | 172.28.40.32    | 33-62          | 172.28.40.63     | 255.255.255.224| /27  |



## Übung 4

Wie lautet die Subnetzmaske bei der Netzadresse: 17.0.0.0 mit 10 verwendbaren Subnetzen, sowie mit mindestens 12 Hosts je Subnetz?
Antwort in Sätzen, wie sie zu dieser Lösung kommen; und erstelle eine Tabelle:

**Antwort**

/28 Netzwerke nehme ich da ich 16 (14) Netzwerkadressen habe, dann habe ich minimun 12 Adressen erreicht.


Quelle: https://www.livewatch.de/de/tools/subnetz/rechner
## Übung 5

Bestimmen Sie die Subnetmaske mit folgenden Angaben:

Netzadresse: 210.52.190.0
Subnetze: Anzahl 5
Mindestanzahl von Hosts je Subnetz: 10

**Antwort**

Ich würde /27 nehmen weil ich dann 8 Subnetze habe da habe ich mehr als die 5 die ich eigendlich brauche aber man kann auch /28 nehmen das wären dann 16 Adressen also 14 Host und das würde auch passen. 

Laut chatGPT = /27
Laut mir    = /28

Quelle: ChatGPT





## Übung 6

Teile  ein /30 Netz auf!    Wozu werden diese /30 Netze am häufigsten verwendet?
Antwort: Für verbindungs Netzwerke (router zu router /  Point-to-Point)

**Antwort**
 Wozu werden diese /30 Netze am häufigsten verwendet? 
    A: Für verbindungs Netzwerke (router zu router /  Point-to-Point)


/30 aufzuteilen macht kein sinn. Man hat keine Hostadressen. also nein danke!


## Übung 7

Nennen Sie den jeweiligen Netz- und Hostanteil der Klassen A, B und C

**Antwort**


     Klasse A	                        Klasse B	                     Klasse C	
0.0.0.0 - 127.255.255.255   |	128.0.0.0 - 191.255.255.255	  |  192.0.0.0 - 223.255.255.255

Quelle: https://www.ionos.at/digitalguide/server/knowhow/classless-inter-domain-routing/ 