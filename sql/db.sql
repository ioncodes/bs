create table rooms
(
	id int auto_increment
		primary key,
	room_id varchar(200) not null,
	start_value int not null,
	owner_id int not null,
	date timestamp default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
	constraint rooms_room_id_uindex
		unique (room_id)
)
engine=InnoDB
;

create index rooms_users_id_fk
	on rooms (owner_id)
;

create table sessions
(
	session_id varchar(128) not null collate utf8mb4_bin
		primary key,
	expires int(11) unsigned not null,
	data text null collate utf8mb4_bin
)
engine=InnoDB
;

create table stocks
(
	id int auto_increment
		primary key,
	amount int not null,
	sell_price double null,
	owner_id int not null,
	room_id int not null,
	buy_price double not null,
	buy_date timestamp default CURRENT_TIMESTAMP not null,
	sell_date timestamp default '0000-00-00 00:00:00' not null,
	symbol varchar(10) not null,
	stock_id varchar(200) not null,
	constraint stocks_stock_id_uindex
		unique (stock_id),
	constraint stocks_rooms_id_fk
		foreign key (room_id) references rooms (id)
)
engine=InnoDB
;

create index stocks_users_id_fk
	on stocks (owner_id)
;

create index stocks_rooms_id_fk
	on stocks (room_id)
;

create table users
(
	id int auto_increment
		primary key,
	username varchar(10) not null,
	password varchar(200) not null,
	first_name varchar(20) not null,
	last_name varchar(20) not null,
	api_token varchar(100) not null,
	constraint users_username_uindex
		unique (username),
	constraint users_api_token_uindex
		unique (api_token)
)
engine=InnoDB
;

alter table rooms
	add constraint rooms_users_id_fk
		foreign key (owner_id) references users (id)
;

alter table stocks
	add constraint stocks_users_id_fk
		foreign key (owner_id) references users (id)
;

