package models

import "io"

type UploadInput struct {
	File        io.Reader
	Name        string
	ContentType string
	BucketName  string
	Size        int64
}
