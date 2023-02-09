-- Data created by myself for practice purposes

INSERT INTO users (name, email, PASSWORD)
    VALUES ('Katie Liu', 'k@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.
'), ('Eric Joo', 'j@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.
'), ('Jia Xin Liu', 'jxl@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.
');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
    VALUES (1, 'Rental 1', 'description', 'https://www.flickr.com/search/?text=house', 'https://www.flickr.com/search/?text=house', 1000, 3, 2, 4, 'Italy', 'Pizza street', 'Milano', 'Milan', 'h29j39', TRUE), (2, 'Apt in the city', 'description', 'https://www.flickr.com/search/?text=house', 'https://www.flickr.com/search/?text=house', 100, 1, 1, 1, 'Canada', 'St-catherine street', 'Montreal', 'Quebec', 'j1z04t', TRUE), (2, 'mansion on the hills', 'description', 'https://www.flickr.com/search/?text=house', 'https://www.flickr.com/search/?text=house', 4900, 5, 3, 6, 'USA', 'Hills street', 'Los Angeles', 'California', '28567', FALSE);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
    VALUES ('2018-09-11','2018-09-26', 2, 2), ('2019-11-11', '2019-11-23', 1, 1), ('2020-02-14', '2020-03-01', 1, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
    VALUES (2, 2, 1, 4, 'message'), (1, 1, 2, 2, 'message'), (3, 1, 3, 3, 'message');