echo "host    all             all             0.0.0.0/0               trust" >> ./pg_hba.conf

pg_ctl -D . -l logfile start;

psql <<- EOSQL
    CREATE USER $PG_PONG_ADMIN WITH PASSWORD '$PG_PONG_PW';
    CREATE DATABASE $PG_PONG_DB;
    GRANT ALL PRIVILEGES ON DATABASE $PG_PONG_DB TO $PG_PONG_ADMIN;
		\c $PG_PONG_DB;

		CREATE TABLE users (user_id varchar(50), nick varchar(50), avatar_url varchar(50));
		CREATE TABLE achivements (user_id varchar(50), achivement varchar(50));
		CREATE TABLE match (winner_id varchar(50), loser_id varchar(50), type varchar(50));
		CREATE TABLE chat (channel_id varchar(50), owner_id varchar(50), type varchar(50), passwd varchar(50));
		CREATE TABLE stat (user_id varchar(50), games varchar(50), win_game varchar(50), loss_game varchar(50), ladder_level varchar(50));
		CREATE TABLE ban (channel_id varchar(50), user_id varchar(50));
		CREATE TABLE admin (channel_id varchar(50), user_id varchar(50));
		CREATE TABLE mute (channel_id varchar(50), user_id varchar(50));
		CREATE TABLE friend (user_id varchar(50), friend_id varchar(50), status varchar(50));

		GRANT ALL PRIVILEGES ON TABLE users TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE achivements TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE match TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE chat TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE stat TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE ban TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE admin TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE mute TO $PG_PONG_ADMIN;
    GRANT ALL PRIVILEGES ON TABLE ban TO $PG_PONG_ADMIN;
EOSQL