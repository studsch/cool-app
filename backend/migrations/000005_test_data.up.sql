-- Register users
INSERT INTO users (
    id, first_name, last_name, login, password,
    phone_number, role, avatar, gender, about,
    city, country, birthday, created_at, updated_at
) VALUES
    (DEFAULT, 'John', 'Doe', 'johndoe', '$2a$10$wSgUJv0GE0dG8awq4ENccu1xE52UQusI12eVjHeMu4fJKhuJPjj1S',
    '+71234567880', 'user', '', 'male', NULL,
    NULL, NULL, '1990-01-01', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Jane', 'Smith', 'janesmith', '$2a$10$mScJK7kQ6JkHhgvXHoP.seisGoQDC6jLE5XH0f0v1pkoL/z.ENQVG',
    '+71234567881', 'user', '', 'female', NULL,
    NULL, NULL, '1992-02-02', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Alice', 'Johnson', 'alicejohnson', '$2a$10$HDI2gnBOB09W7iovHoUNf.YafqsF8uxRmhwSSQbcGrHq2JITXh4f2',
    '+71234567882', 'user', '', 'female', NULL,
    NULL, NULL, '1988-03-03', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Bob', 'Brown', 'bobbrown', '$2a$10$aBgLsbvRZ2aKdMuBIYOTs.T3GldQWN9ROeiutVjF3xrU0jf2AbzpO',
    '+71234567883', 'user', '', 'male', NULL,
    NULL, NULL, '1995-04-04', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Charlie', 'Davis', 'charliedavis', '$2a$10$TVCWdzRWvX7pYtxD.SpgT.1Kq0HpDcRMl9ftZwDUTA8bzmtvHGd2u',
    '+71234567884', 'user', '', 'male', NULL,
    NULL, NULL, '1991-05-05', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Eve', 'Wilson', 'evewilson', '$2a$10$cTwSN8xTO61SuY.mC3izXefXIvv4DRyCrNiyQRsI5EAFOct.dvgp.',
    '+71234567885', 'user', '', 'female', NULL,
    NULL, NULL, '1987-06-06', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Frank', 'Thomas', 'frankthomas', '$2a$10$gCYlL30rgNVtCe3Isd05DuBsiZK8NEIKbFl7Tn/o2lIBkHsnXgbO6',
    '+71234567886', 'user', '', 'male', NULL,
    NULL, NULL, '1993-07-07', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Grace', 'Martinez', 'gracemartinez', '$2a$10$i9EmtX.dE9InV7Yp/vsID.obRmp53N/Dn6ZTP8GBC5Y/eDsvN2yO6',
    '+71234567887', 'user', '', 'female', NULL,
    NULL, NULL, '1989-08-08', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Hank', 'Lee', 'hanklee', '$2a$10$9NwGvfP9M31Ia1Sxbu4DweFsvdCcyeSiystKJ9xeVUV0d/ALto6mq',
    '+71234567888', 'user', '', 'male', NULL,
    NULL, NULL, '1994-09-09', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    (DEFAULT, 'Ivy', 'Kim', 'ivykim', '$2a$10$cU7k0nm2a3wcnr/tTU84UelUggq.xyma6kzptPEWhm94c7YdqXbku',
    '+71234567889', 'user', '', 'female', NULL,
    NULL, NULL, '1986-10-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create follow and friends
INSERT INTO follow (
    id, user_id, follow_to_user_id
) VALUES
    (DEFAULT, (SELECT id FROM users WHERE login = 'johndoe'), (SELECT id FROM users WHERE login = 'janesmith')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'johndoe'), (SELECT id FROM users WHERE login = 'alicejohnson')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'johndoe')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'bobbrown')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'bobbrown'), (SELECT id FROM users WHERE login = 'charliedavis')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'charliedavis'), (SELECT id FROM users WHERE login = 'evewilson')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'evewilson'), (SELECT id FROM users WHERE login = 'frankthomas')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'frankthomas'), (SELECT id FROM users WHERE login = 'gracemartinez')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'gracemartinez'), (SELECT id FROM users WHERE login = 'hanklee')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'hanklee'), (SELECT id FROM users WHERE login = 'ivykim')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'ivykim'), (SELECT id FROM users WHERE login = 'johndoe')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'ivykim'), (SELECT id FROM users WHERE login = 'hanklee')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'frankthomas'), (SELECT id FROM users WHERE login = 'bobbrown')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'charliedavis')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'frankthomas'), (SELECT id FROM users WHERE login = 'alicejohnson')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'alicejohnson')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'frankthomas')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'janesmith'), (SELECT id FROM users WHERE login = 'gracemartinez')),
    (DEFAULT, (SELECT id FROM users WHERE login = 'gracemartinez'), (SELECT id FROM users WHERE login = 'janesmith'));
