import csv
from datetime import datetime
# Sample data representing user interactions
data = [
    {'user_id': 1, 'music_id': 101, 'rating': 4.5, 'genre': 'Rock', 'timestamp': '2023-01-15 08:30:00'},
    {'user_id': 1, 'music_id': 102, 'rating': 3.0, 'genre': 'Afro-beat', 'timestamp': '2023-02-20 12:45:00'},
    {'user_id': 2, 'music_id': 101, 'rating': 5.0, 'genre': 'Pop', 'timestamp': '2023-03-10 15:20:00'},
    {'user_id': 2, 'music_id': 103, 'rating': 4.0, 'genre': 'Jazz', 'timestamp': '2023-04-05 18:10:00'},
    {'user_id': 3, 'music_id': 102, 'rating': 4.5, 'genre': 'Pop', 'timestamp': '2023-05-12 09:55:00'},
    {'user_id': 3, 'music_id': 104, 'rating': 3.5, 'genre': 'Hip-Hop', 'timestamp': '2023-06-20 14:00:00'}
]

# Define field names for CSV
fieldnames = ['user_id', 'music_id', 'rating', 'genre', 'timestamp']

#save the csv file
csv_file = 'music_data_with_genre_and_timestamp.csv'
with open(csv_file, mode='w', newline='') as file:
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    
    # Write header
    writer.writeheader()
    
    # Write data rows
    for row in data:
        writer.writerow(row)

print("Dataset created and saved as", csv_file)

