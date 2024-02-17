package config

import (
	"errors"
	"github.com/spf13/viper"
	"log"
	"time"
)

// Config app config struct
type Config struct {
	Server   ServerConfig
	Postgres PostgresConfig
	Logger   Logger
	JWT      JWT
}

// ServerConfig server config
type ServerConfig struct {
	AppVersion  string
	Host        string
	Port        string
	Mode        string
	ReadTimeout string // TODO: change to time.Duration
}

// JWT json web tokens config
type JWT struct {
	SecretKey        string
	SecretKeyExpire  time.Duration
	RefreshKey       string
	RefreshKeyExpire time.Duration
}

// Logger config
type Logger struct {
	Development       bool
	DisableCaller     bool
	DisableStacktrace bool
	Encoding          string
	Level             string
}

// PostgresConfig postgresql config
type PostgresConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// LoadConfig load config file from given path
func LoadConfig(filename string) (*viper.Viper, error) {
	v := viper.New()

	v.SetConfigName(filename)
	v.AddConfigPath(".")
	v.AutomaticEnv()
	if err := v.ReadInConfig(); err != nil {
		if errors.As(err, &viper.ConfigFileNotFoundError{}) {
			return nil, errors.New("config file not found")
		}
		return nil, err
	}

	return v, nil
}

// ParseConfig parse config file
func ParseConfig(v *viper.Viper) (*Config, error) {
	var c Config

	if err := v.Unmarshal(&c); err != nil {
		log.Printf("unable to decode into struct, %v", err)
		return nil, err
	}

	return &c, nil
}
