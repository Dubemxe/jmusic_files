import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import LabelEncoder

# Load the dataset (Assuming it's in CSV format)
music_data = pd.read_csv('music_data.csv')

# Split the data into training and testing sets
train_data, test_data = train_test_split(music_data, test_size=0.2)

# Encode string values to numerical labels
convert = LabelEncoder()
train_data['genre_encoded'] = convert.fit_transform(train_data['genre'])
train_data['rating_encoded'] = convert.fit_transform(train_data['rating'])
train_data['timestamp_encoded'] = convert.fit_transform(train_data['timestamp'])
#print(train_data[['timestamp', 'timestamp_encoded']].to_string(index=False))
#print(train_data[['genre', 'genre_encoded']].to_string(index=False))
#print(train_data[['rating', 'rating_encoded']].to_string(index=False))

for genre_list in train_data:
    genre_list = train_data['genre'].to_string(index=False)

for rating_list in train_data:
    rating_list = train_data['rating'].to_string(index=False)

# Function to create user-item matrix
def create_user_item_matrix(data):
    users = sorted(data['user_id'].unique())
    items = sorted(data['music_id'].unique())
    user_item_matrix = pd.DataFrame(index=users, columns=items)
    for _, row in data.iterrows():
        user_item_matrix.at[row['user_id'], row['music_id']] = row['rating']
    user_item_matrix = user_item_matrix.fillna(0)
    return user_item_matrix

# Add genre matrix
    genre_matrix = pd.get_dummies(data.set_index('user_id')['genre']).groupby('user_id').sum()
    user_item_matrix = pd.concat([user_item_matrix, genre_matrix], axis=1)


# Calculate user-item matrix
user_item_matrix = create_user_item_matrix(train_data)

# Calculate cosine similarity between users
user_similarity = cosine_similarity(user_item_matrix)

# Function to get recommendations for a user
def get_recommendations(user_id, num_recommendations=5):
    if user_id >= len(user_item_matrix):
        print("Error: Invalid user ID.")
        return []

    # Get music IDs that the user hasn't interacted with
    user_interacted_music = train_data[train_data['user_id'] == user_id]['music_id']
    user_uninteracted_music = [music_id for music_id in user_item_matrix.columns if music_id not in user_interacted_music]

    # Calculate the recommendation scores for uninteracted music
    recommendations = []
    for music_id in user_uninteracted_music:
        score = 0
        for sim_user_id, similarity in enumerate(user_similarity[user_id]):
            if user_item_matrix.at[user_id, music_id] != 0:
                score += similarity * user_item_matrix.at[user_id, music_id]
        recommendations.append((music_id, score))

    # Sort the recommendations by score
    recommendations.sort(key=lambda x: x[1], reverse=True)

    # Return top recommendations
    return recommendations[:num_recommendations]

# Example usage
user_id = 2 
recommendations = get_recommendations(user_id)
print("Recommendations for user", user_id, ":")
for i, (music_id, score) in enumerate(recommendations, start=1):
    print(f"{i}. Music ID: {music_id}, Score: {score}, Genre: {genre_list}, Rating: {rating_list}")

