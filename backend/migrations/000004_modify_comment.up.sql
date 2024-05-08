ALTER TABLE comment
ADD main_comment_id UUID REFERENCES comment (id) ON DELETE CASCADE;
