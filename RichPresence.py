#!/bin/bash/python3
#coding: utf-8

import sys
import time
import json
from pypresence import Presence

with open('configs.json') as configs:
    jsonConfigs = json.load(configs)

client_id = jsonConfigs['application_id']

if not client_id:

    print("Please, fill the application_id in configs.json")
    sys.exit()

start_time=time.time()

RPC = Presence(client_id=client_id)
RPC.connect()

RPC.update(large_image="botavatar",
           large_text="Gurren Lagann",
           buttons=[{"label": "Invite","url": f"https://discord.com/api/oauth2/authorize?client_id={client_id}&permissions=8&scope=bot%20applications.commands"},
                    {"label": "Free Bitcoin", "url": "https://bit.ly/3CVBnLD"}],
           details="Discord Bot",
           state="Click button to invite")

print("Rich Presence running")

while 1:
    time.sleep(15)  # Can only update presence every 15 seconds
