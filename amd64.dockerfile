# :: Header
	FROM node:16.17.0-alpine3.16
    ENV FORCE_COLOR 1

# :: Run
	USER root

	# :: prepare
		RUN set -ex; \
            mkdir -p /iops/dev; \
			mkdir -p /node; \
			apk --update --no-cache add \
				shadow  \
                fio; \
            npm install --save --prefix /tmp \
                chalk@v4.1.2; \
            mv /tmp/node_modules /;

	# :: copy root filesystem changes
        COPY ./rootfs /

# :: Volumes
	VOLUME ["/iops/dev"]

# :: Start
	RUN set -ex; chmod +x /usr/local/bin/entrypoint.sh
	ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]