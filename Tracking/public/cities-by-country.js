/**
 * Villes proposées dans le formulaire (aide à la saisie).
 * Les coordonnées sur la carte sont calculées côté serveur via OpenStreetMap (Nominatim)
 * pour toute adresse hors USA — y compris les petites communes saisies dans « Autre ».
 */
window.CARGOWATCH_CITIES_BY_COUNTRY = {
    IT: [
        'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino',
        'Bari', 'Barletta', 'Belluno', 'Benevento', 'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi',
        'Cagliari', 'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo',
        'Enna', 'Ferrara', 'Firenze', 'Foggia', 'Forlì', 'Frosinone',
        'Genova', 'Gorizia', 'Grosseto',
        'Imperia', 'Isernia',
        'La Spezia', 'L\'Aquila', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca',
        'Macerata', 'Mantova', 'Massa', 'Matera', 'Messina', 'Milano', 'Modena', 'Monza',
        'Napoli', 'Novara', 'Nuoro',
        'Oristano', 'Olbia',
        'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesaro', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone', 'Potenza', 'Prato',
        'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rome', 'Rovigo',
        'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Sud Sardegna',
        'Taranto', 'Teramo', 'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso', 'Trieste', 'Venice',
        'Udine', 'Varese', 'Venezia', 'Verbania', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
    ],
    US: [
        'Albuquerque', 'Arlington', 'Atlanta', 'Austin', 'Bakersfield', 'Baltimore', 'Baton Rouge', 'Birmingham',
        'Boise', 'Boston', 'Buffalo', 'Chandler', 'Charlotte', 'Chesapeake', 'Chicago', 'Chula Vista', 'Cincinnati', 'Cleveland',
        'Colorado Springs', 'Columbus', 'Corpus Christi', 'Dallas', 'Denver', 'Des Moines', 'Detroit', 'Durham',
        'El Paso', 'Fort Lauderdale', 'Fort Wayne', 'Fort Worth', 'Fresno', 'Garland', 'Gilbert', 'Glendale',
        'Grand Rapids', 'Greensboro', 'Henderson', 'Hialeah', 'Honolulu', 'Houston', 'Huntington Beach', 'Indianapolis',
        'Irvine', 'Irving', 'Jacksonville', 'Jersey City', 'Kansas City', 'Laredo', 'Las Vegas', 'Lexington',
        'Lincoln', 'Long Beach', 'Los Angeles', 'Louisville', 'Lubbock', 'Madison', 'Memphis', 'Mesa', 'Miami',
        'Milwaukee', 'Minneapolis', 'Modesto', 'Montgomery', 'Nashville', 'New Orleans', 'New York', 'Newark',
        'Norfolk', 'North Las Vegas', 'Oakland', 'Oklahoma City', 'Omaha', 'Orlando', 'Philadelphia', 'Phoenix',
        'Pittsburgh', 'Plano', 'Portland', 'Raleigh', 'Reno', 'Richmond', 'Riverside', 'Rochester', 'Sacramento',
        'Saint Louis', 'Saint Paul', 'Salt Lake City', 'San Antonio', 'San Bernardino', 'San Diego', 'San Francisco',
        'San Jose', 'Santa Ana', 'Scottsdale', 'Seattle', 'Spokane', 'Stockton', 'Tampa', 'Toledo', 'Tucson', 'Tulsa',
        'Virginia Beach', 'Washington', 'Wichita'
    ],
    FR: [
        'Aix-en-Provence', 'Ajaccio', 'Albi', 'Alès', 'Amiens', 'Angers', 'Angoulême', 'Annecy', 'Antibes', 'Antony',
        'Argenteuil', 'Arles', 'Aubagne', 'Aulnay-sous-Bois', 'Avignon',
        'Bayonne', 'Besançon', 'Béziers', 'Biarritz', 'Blois', 'Bordeaux', 'Boulogne-Billancourt', 'Bourges', 'Brest', 'Brive-la-Gaillarde',
        'Caen', 'Calais', 'Cannes', 'Carcassonne', 'Cergy', 'Chambéry', 'Châteauroux', 'Cherbourg', 'Cholet', 'Clermont-Ferrand', 'Colmar', 'Compiègne', 'Créteil',
        'Dijon', 'Douai', 'Drancy', 'Dunkerque',
        'Évry', 'Évreux',
        'Fréjus',
        'Gap', 'Gennevilliers', 'Grenoble',
        'Haguenau', 'Hyères',
        'Issy-les-Moulineaux',
        'La Rochelle', 'La Seyne-sur-Mer', 'Laval', 'Le Havre', 'Le Mans', 'Lille', 'Limoges', 'Lorient', 'Lyon',
        'Mâcon', 'Marseille', 'Martigues', 'Massy', 'Melun', 'Metz', 'Montauban', 'Montpellier', 'Montreuil', 'Mulhouse',
        'Nancy', 'Nanterre', 'Nantes', 'Nevers', 'Nice', 'Nîmes', 'Niort',
        'Orléans',
        'Paris', 'Pau', 'Perpignan', 'Poissy', 'Poitiers', 'Pontoise',
        'Quimper',
        'Reims', 'Rennes', 'Roubaix', 'Rouen',
        'Saint-Denis', 'Saint-Étienne', 'Saint-Malo', 'Saint-Nazaire', 'Saint-Quentin', 'Schiltigheim', 'Strasbourg',
        'Tarbes', 'Toulon', 'Toulouse', 'Tours', 'Troyes',
        'Valence', 'Vannes', 'Versailles', 'Villeurbanne', 'Vitrolles'
    ],
    DE: [
        'Aachen', 'Augsburg', 'Berlin', 'Bielefeld', 'Bochum', 'Bonn', 'Bremen', 'Chemnitz', 'Cologne', 'Dortmund',
        'Dresden', 'Duisburg', 'Düsseldorf', 'Erfurt', 'Essen', 'Frankfurt', 'Freiburg', 'Gelsenkirchen', 'Hamburg',
        'Hannover', 'Heidelberg', 'Kiel', 'Krefeld', 'Leipzig', 'Leverkusen', 'Lübeck', 'Magdeburg', 'Mainz', 'Mannheim',
        'Munich', 'Münster', 'Nuremberg', 'Oberhausen', 'Rostock', 'Saarbrücken', 'Stuttgart', 'Wiesbaden', 'Wuppertal', 'Würzburg'
    ],
    ES: [
        'A Coruña', 'Alcalá de Henares', 'Albacete', 'Alcalá de Guadaíra', 'Algeciras', 'Alicante', 'Almería', 'Ávila', 'Badajoz',
        'Badalona', 'Barakaldo', 'Barcelona', 'Benidorm', 'Bilbao', 'Burgos', 'Cáceres', 'Cádiz', 'Cartagena', 'Castellón de la Plana',
        'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Donostia-San Sebastián', 'Dos Hermanas', 'Elche', 'Fuenlabrada', 'Getafe', 'Gijón',
        'Girona', 'Granada', 'Guadalajara', 'Huelva', 'Huesca', 'Jerez de la Frontera', 'Las Palmas de Gran Canaria', 'Leganés', 'León',
        'Lleida', 'Logroño', 'Lorca', 'Lugo', 'Madrid', 'Málaga', 'Marbella', 'Melilla', 'Mérida', 'Móstoles', 'Murcia', 'Oviedo',
        'Palencia', 'Palma', 'Pamplona', 'Parla', 'Pontevedra', 'Reus', 'Roquetas de Mar', 'Sabadell', 'Salamanca', 'San Cristóbal de La Laguna',
        'Santa Coloma de Gramenet', 'Santa Cruz de Tenerife', 'Santander', 'Santiago de Compostela', 'Segovia', 'Sevilla', 'Soria',
        'Talavera de la Reina', 'Tarragona', 'Telde', 'Terrassa', 'Toledo', 'Torrejón de Ardoz', 'Torrent', 'Valencia', 'Valladolid',
        'Vigo', 'Vitoria-Gasteiz', 'Zaragoza'
    ],
    GB: [
        'Aberdeen', 'Belfast', 'Birmingham', 'Blackpool', 'Bolton', 'Bradford', 'Brighton', 'Bristol', 'Cambridge', 'Cardiff',
        'Coventry', 'Derby', 'Dundee', 'Edinburgh', 'Exeter', 'Glasgow', 'Hull', 'Leeds', 'Leicester', 'Liverpool',
        'London', 'Luton', 'Manchester', 'Middlesbrough', 'Newcastle', 'Northampton', 'Norwich', 'Nottingham', 'Oxford',
        'Peterborough', 'Plymouth', 'Portsmouth', 'Preston', 'Reading', 'Sheffield', 'Southampton', 'Stoke-on-Trent',
        'Sunderland', 'Swansea', 'Swindon', 'Wolverhampton', 'York'
    ],
    CA: [
        'Calgary', 'Charlottetown', 'Edmonton', 'Fredericton', 'Halifax', 'Hamilton', 'Iqaluit', 'Kelowna',
        'Kitchener', 'London', 'Mississauga', 'Moncton', 'Montreal', 'Ottawa', 'Quebec City', 'Regina', 'Saskatoon',
        'St. John\'s', 'Toronto', 'Vancouver', 'Victoria', 'Whitehorse', 'Windsor', 'Winnipeg', 'Yellowknife'
    ],
    AU: [
        'Adelaide', 'Albury', 'Ballarat', 'Brisbane', 'Bunbury', 'Cairns', 'Canberra', 'Darwin', 'Geelong', 'Gold Coast',
        'Hobart', 'Launceston', 'Mackay', 'Melbourne', 'Newcastle', 'Perth', 'Rockhampton', 'Sunshine Coast', 'Sydney', 'Toowoomba',
        'Townsville', 'Wollongong'
    ],
    MX: [
        'Acapulco', 'Aguascalientes', 'Cancún', 'Chihuahua', 'Ciudad Juárez', 'Cuernavaca', 'Culiacán', 'Durango',
        'Guadalajara', 'Guanajuato', 'Hermosillo', 'León', 'Mérida', 'Mexicali', 'Mexico City', 'Monterrey', 'Morelia',
        'Oaxaca', 'Puebla', 'Querétaro', 'Saltillo', 'San Luis Potosí', 'Tijuana', 'Toluca', 'Torreón', 'Veracruz'
    ],
    BR: [
        'Belém', 'Belo Horizonte', 'Brasília', 'Campinas', 'Curitiba', 'Fortaleza', 'Goiânia', 'Guarulhos', 'Manaus',
        'Porto Alegre', 'Recife', 'Rio de Janeiro', 'Salvador', 'São Luís', 'São Paulo', 'Sorocaba', 'Teresina'
    ],
    JP: [
        'Chiba', 'Fukuoka', 'Hiroshima', 'Kawasaki', 'Kobe', 'Kyoto', 'Nagoya', 'Niigata', 'Okayama', 'Osaka', 'Saitama',
        'Sapporo', 'Sendai', 'Tokyo', 'Yokohama'
    ],
    CN: [
        'Beijing', 'Changsha', 'Chengdu', 'Chongqing', 'Dongguan', 'Foshan', 'Guangzhou', 'Hangzhou', 'Hong Kong',
        'Nanjing', 'Shanghai', 'Shenzhen', 'Suzhou', 'Tianjin', 'Wuhan', 'Xi\'an', 'Zhengzhou'
    ],
    IN: [
        'Ahmedabad', 'Bangalore', 'Bhopal', 'Chennai', 'Delhi', 'Hyderabad', 'Indore', 'Jaipur', 'Kanpur', 'Kolkata',
        'Lucknow', 'Mumbai', 'Nagpur', 'Patna', 'Pune', 'Surat', 'Thane', 'Vadodara', 'Visakhapatnam'
    ],
    AE: [
        'Abu Dhabi', 'Ajman', 'Al Ain', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'
    ]
};
