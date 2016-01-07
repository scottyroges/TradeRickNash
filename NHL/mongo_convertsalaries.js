var db = connect("nhldb");

var allplayers = db.players.find();

var counter =0;
for(var i = 0; i < allplayers.length(); i++){
	if(allplayers[i]['20142015'] && allplayers[i]['20142015']['cap-hit']){
		allplayers[i]['20142015']['cap-hit'] = parseFloat(allplayers[i]['20142015']['cap-hit'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20142015'] && allplayers[i]['20142015']['cash']){
		allplayers[i]['20142015']['cash'] = parseFloat(allplayers[i]['20142015']['cash'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20142015'] && allplayers[i]['20142015']['contract-value']){
		allplayers[i]['20142015']['contract-value'] = parseFloat(allplayers[i]['20142015']['contract-value'].replace(/\$|,/g, ''))
	}


	if(allplayers[i]['20132014'] && allplayers[i]['20132014']['cap-hit']){
		allplayers[i]['20132014']['cap-hit'] = parseFloat(allplayers[i]['20132014']['cap-hit'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20132014'] && allplayers[i]['20132014']['cash']){
		allplayers[i]['20132014']['cash'] = parseFloat(allplayers[i]['20132014']['cash'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20132014'] && allplayers[i]['20132014']['contract-value']){
		allplayers[i]['20132014']['contract-value'] = parseFloat(allplayers[i]['20132014']['contract-value'].replace(/\$|,/g, ''))
	}


	if(allplayers[i]['20122013'] && allplayers[i]['20122013']['cap-hit']){
		allplayers[i]['20122013']['cap-hit'] = parseFloat(allplayers[i]['20122013']['cap-hit'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20122013'] && allplayers[i]['20122013']['cash']){
		allplayers[i]['20122013']['cash'] = parseFloat(allplayers[i]['20122013']['cash'].replace(/\$|,/g, ''))
	}
	if(allplayers[i]['20122013'] && allplayers[i]['20122013']['contract-value']){
		allplayers[i]['20122013']['contract-value'] = parseFloat(allplayers[i]['20122013']['contract-value'].replace(/\$|,/g, ''))
	}

	db.players.save(allplayers[i]);
}

print(counter);


