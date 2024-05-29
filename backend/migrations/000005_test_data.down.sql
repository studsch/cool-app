-- Delete all follows
DELETE FROM follow
WHERE user_id IN (
    SELECT id FROM users
    WHERE login IN (
    'johndoe', 'janesmith', 'alicejohnson', 'bobbrown', 'charliedavis',
    'evewilson', 'frankthomas', 'gracemartinez', 'hanklee', 'ivykim'
));
DELETE FROM follow
WHERE follow_to_user_id IN (
    SELECT id FROM users
    WHERE login IN (
    'johndoe', 'janesmith', 'alicejohnson', 'bobbrown', 'charliedavis',
    'evewilson', 'frankthomas', 'gracemartinez', 'hanklee', 'ivykim'
));

-- Delete all users
DELETE FROM users
WHERE login IN (
    'johndoe', 'janesmith', 'alicejohnson', 'bobbrown', 'charliedavis',
    'evewilson', 'frankthomas', 'gracemartinez', 'hanklee', 'ivykim'
);
