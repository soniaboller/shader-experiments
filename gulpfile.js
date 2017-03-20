'use strict';

var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var db = require('./models/db');
var knex = require('knex');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

gulp.task('db_create_user_table', function() {
    var sqlString = "CREATE TABLE user_accounts (" +
        "id INT NOT NULL AUTO_INCREMENT," +
        "username VARCHAR(20) NOT NULL UNIQUE," +
        "email VARCHAR(255) NOT NULL UNIQUE, " +
        "password_hash VARCHAR(61) NOT NULL, " +
        "PRIMARY KEY (id) " +
        ");";
    //callback(response)
    function cb(res) {
        console.log(res);
    }
    db.knex.raw(sqlString).then(cb);
    //db.raw(query).then(callback)
});

gulp.task('db_create_photos_table', function(){
    var sqlString = "CREATE TABLE photos (" +
        "id INT NOT NULL AUTO_INCREMENT, " +
        "location VARCHAR(30), " +
        "artist VARCHAR(30), " +
        "user_account_id INT NOT NULL REFERENCES user_accounts(id)," +
        "image_as_base64 LONGTEXT," +
        "PRIMARY KEY (id) " +
        ");";
    //callback(response)
    function cb(res) {
        console.log(res);
    }
    db.knex.raw(sqlString).then(cb);
    //db.raw(query).then(callback)
});

gulp.task('db_drop_user_table', function() {
    var sqlString = "drop table user_accounts;";
    //callback(response)
    function cb(res) {
        console.log(res);
    }
    db.knex.raw(sqlString).then(cb);
    //db.raw(query).then(callback)
});

gulp.task('db_drop_photos_table', function() {
    var sqlString = "drop table photos;";
    //callback(response)
    function cb(res) {
        console.log(res);
    }
    db.knex.raw(sqlString).then(cb);
    //db.raw(query).then(callback)
});

gulp.task('Nodemon', restartServer);

function restartServer() {
    nodemon({
        script: './bin/www',
        ext: 'js hbs scss sql'
    });
}

gulp.task('compile-sass', function(){
    gulp.src('./public/styles/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./public/styles'))
});

gulp.task('sass-watch', function(){
    gulp.watch(['./public/styles/*.scss'], ['compile-sass'])
});

gulp.task('default', ['Nodemon','sass-watch']);
