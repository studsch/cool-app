package config

// Config app config struct
type Config struct {
	Server ServerConfig
	Logger Logger
}

// ServerConfig server config struct
type ServerConfig struct {
	AppVersion  string
	Host        string
	Port        string
	ReadTimeout string
	Mode        string
}

// Logger struct
type Logger struct {
	Development       bool
	DisableCaller     bool
	DisableStacktrace bool
	Encoding          string
	Level             string
}
