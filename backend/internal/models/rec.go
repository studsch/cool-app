package models

type RecModel struct {
	Name  string
	Type  uint32
	Valid bool
}

type DataMap map[string]Values

type Values struct {
	PostsIDs []string `json:"values"`
}

type OutRecMap map[string][]Post
