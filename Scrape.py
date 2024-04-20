from bs4 import BeautifulSoup

# Importing the HTTP library
import requests as req
import csv


episode_dict = ["The Cat and the Claw Part I", 
            "On Leather Wings",
            "Christmas with the Joker",
            "Feat of Clay Part I",
            "Feat of Clay Part II",
            "It's Never Too Late",
            "Joker's Favor",
            "The Cat and the Claw Part II",
            "Pretty Poison",
            "Nothing to Fear",
            "Be a Clown",
            "Appointment in Crime Alley",
            "P.O.V.",
            "Heart of Ice",
            "The Last Laugh",
            "Eternal Youth",
            "Two-Face Part I",
            "Two-Face Part II",
            "Fear of Victory",
            "I've Got Batman in My Basement",
            "Vendetta",
            "Prophecy of Doom",
            "The Forgotten",
            "Mad as a Hatter",
            "The Cape and Cowl Conspiracy",
            "The Clock King (episode)",
            "Perchance to Dream",
            "The Underdwellers",
            "Night of the Ninja",
            "The Strange Secret of Bruce Wayne",
            "Tyger, Tyger",
            "Dreams in Darkness",
            "Beware the Gray Ghost",
            "Cat Scratch Fever",
            "I Am the Night",
            "Almost Got 'Im",
            "Moon of the Wolf",
            "Terror in the Sky",
            "Heart of Steel Part I",
            "Heart of Steel Part II",
            "If You're So Smart, Why Aren't You Rich?",
            "Joker's Wild",
            "",
            "Off Balance",
            "What is Reality?",
            "The Laughing Fish",
            "Harley and Ivy",
            ""
            "The Man Who Killed Batman",
            "Zatanna (episode)",
            "Robin's Reckoning Part I",
            "",
            "Robin's Reckoning Part II",
            "",
            "Day of the Samurai",
            "See No Evil",
            "The Demon's Quest Part I",
            "The Demon's Quest Part II",
            "",
            "Shadow of the Bat Part I",
            "Shadow of the Bat Part II"
            ]
'''
TODO Add these episodes of later seasons to csv file (Code does not work for later seasons)
episode_dict = [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "Riddler's Reform",
            "Baby-Doll",
            "Time Out of Joint",
            "",
            "",
            "Batgirl Returns",
            "Lock-Up (episode)",
            "",
            "Showdown",
            "",
            "",
            "",
            ""]
'''

i = 0
season = 1
with open("dialogue.csv", "w", newline='', encoding="utf-8") as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(["Season", "Episode", "Title", "Scene", "Person", "Said"])
    
    for episode in episode_dict:
        # Get Episode and Season Number
        print(episode)
        i = i + 1
        if i > 60:
            season = 2
            i = 1
        elif i > 10 and season == 2:
            season = 3
            i = 1
        elif i > 5 and season == 3:
            season = 4
        if episode:
            # Get title of episode and convert episode title to URL friendly string for scraping
            title = episode
            episode = episode.replace(" ", "_")
            episode = episode.replace("'", "%27")
            episode = episode.replace("?", "%3F")
            
            
            get_str = "https://batmantheanimatedseries.fandom.com/wiki/" + episode + "/Dialogue"
            html_doc = req.get(get_str)

            if html_doc:
                S = BeautifulSoup(html_doc.content, 'html.parser')

                # Get DIV block(s) that holds dialogue and scene titles
                script = S.find_all('div', {"class": ['toccolours', 'mw-collapsible', 'mw-collapsed', 'mw-made-collapsible']})
                
                # Iterate through blocks of dialogue
                for item in script:
                    # For P elements it is a scene, get scene title
                    scene = item.find('p')
                    try:
                        # Get rid of html syntax leaving only string
                        cleantext = BeautifulSoup(str(scene), "lxml").text
                        if cleantext != "":
                            scene = cleantext.strip()
                    except Exception as e:
                        print("Error:", e)

                    # Get Single div dialogue block
                    dialogueBlocks = item.find('div', class_='mw-collapsible-content')
                    dialogue =  dialogueBlocks.find_all(['li', 'p'])
                    
                    # Iterate through line of dialogue in block
                    for line in dialogue:
                        try:
                            cleantext = BeautifulSoup(str(line), "lxml").text
                            # If theres a semi colon then someone said something, get who said it and what was said, else it was something that happens in the scene
                            if ":" in cleantext:
                                person = cleantext.split(":")[0].strip()
                                said = cleantext.split(":")[1].strip()
                                if cleantext != "":
                                    writer.writerow([season, i, title, scene, person, said])
                            else:
                                if cleantext != "":
                                    writer.writerow([season, i, title, scene, "", cleantext.strip()])
                        except Exception as e:
                            print("Error:", e)
            else:
                print("fail")