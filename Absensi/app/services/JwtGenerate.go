package services

import (
	"errors"
	"time"

	"github.com/goravel/framework/facades"
	"github.com/golang-jwt/jwt/v5"
)

type JwtGenerate struct {
	UserID uint `json:"user_id"`
	jwt.RegisteredClaims
}

func jwtSecret() string {
	return facades.Config().GetString("jwt.secret")
}

// fungsi GenerateToken menghasilkan token JWT untuk user dengan userID tertentu.
func NewJwtGenerate(userID uint) (string, error) {
	claims := &JwtGenerate{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt: jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(jwtSecret()))
}

// Validasi token JWT dan mengembalikan klaimnya jika valid.
func ValidateToken(tokenString string) (*JwtGenerate, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		&JwtGenerate{},
		func(token *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret()), nil
		},
	)

	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*JwtGenerate)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	return claims, nil
}